import { useMemo } from 'react';

export const useSortedPosts = (posts, sort) => {
  const sortedPosts = useMemo(() => {
    console.log('Отработала функция')
    if (sort) {
      return [...posts].sort((a, b) => a[sort].localeCompare(b[sort])) // Сравниваем строки для сортировки (поле из объекта a с полем из объекта b)
    }
    return posts;
  }, [sort, posts]) // В константе sortedPosts лежит отсортированный массив, и при этом массив posts никак не изменяется

  return sortedPosts;
}

export const usePosts = (posts, sort, query) => {
  const sortedPosts = useSortedPosts(posts, sort); // Получаем массив отсортированных постов выше

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.title.toLowerCase().includes(query))
  }, [query, sortedPosts])

  return sortedAndSearchedPosts;
}