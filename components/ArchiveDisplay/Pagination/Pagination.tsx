import React from "react";
import styles from "./Pagination.module.scss"

interface PaginationInterface {

}

const Pagination = ({ allMarkers, setcurrentPageContents, currentPage, setcurrentPage }: any) => {
  const [postsPerPage, setpostsPerPage] = React.useState<number>(5);
  const [pageNumbers, setpageNumbers] = React.useState<number[]>([]);

  const calculatePageNumbers = (postArray: any, postsPerPage: any) => {
    let pageNumberArr = [];
    for (let i = 1; i <= Math.ceil(postArray.length / postsPerPage); i++) {
      pageNumberArr.push(i);
    }
    return pageNumberArr;
  };

  const calculateCurrentPageContents = (currentPage: number, postsPerPage: number, postArray: any[]) => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = postArray.slice(indexOfFirstPost, indexOfLastPost);
    return currentPosts;
  };

  React.useEffect(() => {
    setpageNumbers(calculatePageNumbers(Array.from(allMarkers), postsPerPage));
    setcurrentPageContents(calculateCurrentPageContents(currentPage, postsPerPage, Array.from(allMarkers)));
  }, [allMarkers]);

  React.useEffect(() => {
    setcurrentPageContents(calculateCurrentPageContents(currentPage, postsPerPage, allMarkers));
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  React.useEffect(() => {
    setpageNumbers(calculatePageNumbers(allMarkers, postsPerPage));
    setcurrentPage(1);
    setcurrentPageContents(calculateCurrentPageContents(currentPage, postsPerPage, allMarkers));
  }, [postsPerPage]);

  return (
    <div className={styles.paginationContainer}>
      <ul className={styles.paginationList}>
        {pageNumbers.map((pageNumber: any) => {
          return (
            <li key={pageNumber} onClick={() => setcurrentPage(pageNumber)}>
              <span className={`globalBtn ${pageNumber === currentPage && "globalBtnActive"}`}>
                {pageNumber}
              </span>
            </li>
          );
        })}
      </ul>
      <p>{allMarkers.size} posts</p>
      <select
        defaultValue={5}
        onChange={(e) => setpostsPerPage(+e.target.value)}
      >
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
      </select>
      <p>posts/page</p>
    </div>
  );
};

export default Pagination;
