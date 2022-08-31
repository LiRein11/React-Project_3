import React, { useEffect, useState } from 'react';
// import Counter from './components/Counter';
// import ClassCounter from './components/ClassCounter';
import './styles/App.css';
// import PostItem from './components/PostItem';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/MyModal/MyModal';
import MyButton from './components/UI/button/MyButton';
import { usePosts } from './hooks/usePosts';
import PostService from './API/PostService';
import Loader from './components/UI/Loader/Loader';
import { useFetching } from './hooks/useFetching';
import { getPageCount } from './utils/pages.js'
import Pagination from './components/UI/pagination/Pagination';

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);


  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data)
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit));
  }) // Собственный хук, который предоставляет обработку индикации загрузки (частый функционал) и обработку ошибки какого-то запроса на получение данных. При этом он возвращает массив состоящий из 3х элементов и этими компонентами внутри каждого компонента можно управлять как угодно

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  };

  // Получение post из дочернего компонента
  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id)) // Возвращает массив отфильтрованный по условию, что возвращаются все посты массива кроме удаленного
  }

  const changePage = (page) => {
    setPage(page)
    fetchPosts(limit, page)
  }

  return (
    <div className='App'>
      <button onClick={fetchPosts}>get</button>
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Создать пользователя
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} /> {/* Горизонтальный разделитель (линия)*/}
      <PostFilter
        filter={filter}
        setFilter={setFilter} />
      {postError &&
        <h1>Прозошла ошибка</h1>
      }
      {isPostsLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Список постов про JS' />
      }
      <Pagination
        page={page}
        changePage={changePage}
        totalPages={totalPages} />
    </div>
  );
}

export default App;