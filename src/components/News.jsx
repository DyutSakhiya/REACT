import React, { useEffect, useState } from "react";
import Newsitems from "./Newsitems";
import Spinner from "./Spinner";
import PropTypes, { element } from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [page, setPage] = useState(1);
  const [totalResults, settotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=78efee73f0144ade90c1e8b3581f3554&page=${
      page + 1
    }&pageSize=${props.pageSize}`;

    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    settotalResults(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - 9TvNews`;

    updateNews();
  }, []);

  const handleBackClick = async () => {
    setPage(page - 1);
    updateNews();
  };

  const handleNextClick = async () => {
    setPage(page + 1);
    updateNews();
  };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=78efee73f0144ade90c1e8b3581f3554&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);

    try {
      const response = await fetch(url);
      const parsedData = await response.json();
      setArticles(articles.concat(parsedData.articles));
      settotalResults(parsedData.totalResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      setState({ loading: false });
    }
  };

  return (
    <div className="container my-3 mx-4 text-3xl font-bold  ">
      <h1>Tv9 - Top {capitalizeFirstLetter(props.category)} Headline</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="row flex justify-around  mt-4 flex-wrap ">
          {articles.map((Element) => {
            return (
              <div className="col-md-4 mt-6" key={Element.url}>
                <Newsitems
                  title={Element.title ? Element.title.slice(0, 45) : ""}
                  description={
                    Element.description ? Element.description.slice(0, 88) : ""
                  }
                  imageUrl={Element.urlToImage}
                  newsurl={Element.url}
                  author={Element.author}
                  date={Element.publishedAt}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 6,
  category: "general",
};

News.PropTypes = {
  country: PropTypes.string,
  pageSize: PropTypes,
  category: PropTypes.string,
};

export default News;
