import React, {useState} from 'react';
import MyButton from '../components/UI/button/MyButton';
import MyInput from '../components/UI/input/MyInput';

const PostForm = ({create}) => {
  const [post, setPost] = useState({ title: '', body: '' });

  // const bodyInputRef = useRef(); // Второй способ получения данных у неуправляемого инпута

  const addNewPost = (e) => {
    e.preventDefault()

    // setPosts([...posts, { ...post, id: Date.now() }]) // Разворачиваем старый массив с постами и в конец добавляем новый (но тут это уже не доступно, поэтому делаем следующее)
    const newPost = {
      ...post, id:Date.now()
    }
    create(newPost) 
    setPost({ title: '', body: '' })
  }; // Первый способ получения данных у управляемого инпута

  return (
    <div>
      <form>
        {/*Управляемый компонент*/}
        <MyInput
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })} // Двухстороннее связывание
          type="text"
          placeholder='Название поста'
        />
        {/* <input ref = {bodyInputRef} type='text'/> */}
        {/* Неуправляемый/Некотролируемый элемент */}
        <MyInput
          value={post.body}
          onChange={(e) => setPost({ ...post, body: e.target.value })}
          type="text"
          placeholder='Описание поста'
        />
        <MyButton onClick={addNewPost}>Создать пост</MyButton>
      </form>
    </div>
  );
};

export default PostForm;