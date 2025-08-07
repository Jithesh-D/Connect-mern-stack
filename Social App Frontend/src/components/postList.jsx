import { useContext, useEffect, useState } from "react";
import Post from "./posts";
import { PostList as PostListData } from "../store/postListContext.jsx";
import WelcomeMessage from "./welcomeMessage.jsx";
import Loader from "./loading.jsx";
import { useNavigate } from "react-router-dom";

const PostList = () => {
  const { postList, addInitialPost } = useContext(PostListData);
  const [fetchingData, setFetchingData] = useState(false);

  //can also use buutons for fetching
  //  const onClickFetchPost=()=>{}

  useEffect(() => {
    setFetchingData(true);
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => {
        addInitialPost(data.posts);
        setFetchingData(false);
      });
  }, []);

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
