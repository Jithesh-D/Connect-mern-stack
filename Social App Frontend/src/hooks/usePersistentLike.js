import { useState, useEffect } from 'react';
import { likePost, unlikePost } from '../services/service';

export const usePersistentLike = (post, currentUserId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactions || 0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize like state from backend data
  useEffect(() => {
    if (currentUserId && post.likedBy) {
      const userHasLiked = post.likedBy.some(
        (userId) => String(userId) === String(currentUserId)
      );
      setIsLiked(userHasLiked);
    }
    setLikeCount(post.reactions || 0);
  }, [post.likedBy, post.reactions, currentUserId]);

  const toggleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!isLiked) {
        // Optimistic update
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        
        const response = await likePost(post.id);
        if (response?.reactions != null) {
          setLikeCount(response.reactions);
        }
        setIsLiked(Boolean(response?.hasLiked));
      } else {
        // Optimistic update
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
        
        const response = await unlikePost(post.id);
        if (response?.reactions != null) {
          setLikeCount(response.reactions);
        }
        setIsLiked(Boolean(response?.hasLiked));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic updates on error
      setLikeCount(post.reactions || 0);
      setIsLiked(
        post.likedBy?.some(userId => String(userId) === String(currentUserId)) || false
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isLiked,
    likeCount,
    isProcessing,
    toggleLike
  };
};