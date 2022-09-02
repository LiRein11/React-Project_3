import React, { useEffect, useRef, useState } from 'react';
// import Counter from './components/Counter';
// import ClassCounter from './components/ClassCounter';
// import PostItem from './components/PostItem';
import PostService from '../API/PostService';
import PostFilter from '../components/PostFilter';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import MyButton from '../components/UI/button/MyButton';
import Loader from '../components/UI/Loader/Loader';
import MyModal from '../components/UI/MyModal/MyModal';
import Pagination from '../components/UI/pagination/Pagination';
import MySelect from '../components/UI/select/MySelect';
import { useFetching } from '../hooks/useFetching';
import { useObserver } from '../hooks/useObserver';
import { usePosts } from '../hooks/usePosts';
import { getPageCount } from '../utils/pages.js';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const lastElement = useRef();

  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page);
    setPosts([...posts, ...response.data])
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit));
  }) // Собственный хук, который предоставляет обработку индикации загрузки (частый функционал) и обработку ошибки какого-то запроса на получение данных. При этом он возвращает массив состоящий из 3х элементов и этими компонентами внутри каждого компонента можно управлять как угодно

  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1);
  })

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit])

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
  }

  return (
    <div className='App'>
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Создать пользователя
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} /> {/* Горизонтальный разделитель (линия)*/}
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      <MySelect
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue={'Кол-во элементов на странице'}
        options={[
          { value: 5, name: '5' },
          { value: 10, name: '10' },
          { value: 25, name: '25' },
          { value: -1, name: 'Показать все' },
        ]}
      />
      {postError &&
        <h1>Прозошла ошибка</h1>
      }
      <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Список постов про JS' />
      <div ref={lastElement} style={{ height: 20, background: 'red' }}></div>
      {isPostsLoading &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>
      }
      <Pagination
        page={page}
        changePage={changePage}
        totalPages={totalPages} />
    </div>
  );
}

export default Posts;