import { useContext, useEffect, useState } from "react";
import Post from "./posts";
import { PostList as PostListData } from "../store/postListContext.jsx";
import WelcomeMessage from "./welcomeMessage.jsx";
import Loader from "./loading.jsx";
import { getPostsFromServer } from "../services/service.jsx";

const PostList = () => {
  const { postList, addInitialPost } = useContext(PostListData);
  const [fetchingData, setFetchingData] = useState(false);

  //can also use buutons for fetching
  //  const onClickFetchPost=()=>{}

  useEffect(() => {
    const fetchPosts = async () => {
      setFetchingData(true);
      try {
        const posts = await getPostsFromServer();
        addInitialPost(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchPosts();
  }, []);
  // useEffect(() => {
  //   setFetchingData(true);
  //   fetch("https://dummyjson.com/posts")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       addInitialPost(data.posts);
  //       setFetchingData(false);
  //     });
  // }, []);

  return (
    <>
      {fetchingData && <Loader />}
      {!fetchingData && postList.length === 0 && <WelcomeMessage />}
      {postList.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default PostList;