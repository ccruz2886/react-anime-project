import React from 'react';

import Styled from 'styled-components';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import AnimeGridList from './AnimeGridList';

const LoadMoreContainer = Styled.div`
  text-align: center;
`;

const CircularProgressStyle = Styled(CircularProgress)`
  text-align: center;
`;

const GridContainer = Styled.div``;

class AnimeGrid extends React.PureComponent {
  state = {
    dataSource: [],    
  }
  
  lastScrollTop = 0;

  static defaultProps = {
    infiniteScroll: true,
    loadBeforeScrollEnd: 500,
    dataSourceLimit: 60,
  }

  static propTypes = {
    infiniteScroll: PropTypes.bool,
    loadBeforeScrollEnd: PropTypes.number,
    animes: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFeching: PropTypes.bool.isRequired,
    fetchAnimesListIfIsNeeded: PropTypes.func.isRequired,
    fetchNextPageAnimeList: PropTypes.func.isRequired,
  }

  componentWillReceiveProps = ({ animes }) => {
    if (this.props.animes.length !== animes.length){
      let newAnimeData = this.getInitialDataSource(animes);
      this.setState({ dataSource: newAnimeData });
    }
  }

  componentDidMount = () => {
    const { isFeching, fetchAnimesListIfIsNeeded, animes } = this.props;

    if (!isFeching) {    
      fetchAnimesListIfIsNeeded();
    }

    if (this.props.infiniteScroll) {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleScroll);
    }

    let newDataSource = this.getInitialDataSource(animes);
    this.setState({ dataSource: newDataSource });
  }

  componentWillUnmount = () => {
    if (this.props.infiniteScroll) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleScroll);
    }
  };

  getInitialDataSource = animes => {
    let newDataSource = animes;
    let { dataSourceLimit } = this.props;

    if (animes.length > dataSourceLimit) {
      let lastIndex = animes.length;
      let startIndex = animes.length - (dataSourceLimit + 1);
      newDataSource = animes.slice(startIndex, lastIndex);
    }
    return newDataSource;
  }

  fetchNextPageAnime = () => {
    if (this.props.isFeching) {
      return;
    }

    const { dataSource } = this.state;
    const { animes } = this.props;
    const isLastDataSource = animes[animes.length - 1].id === dataSource[dataSource.length - 1].id;
    const currentWindowHeight =
      (window.innerHeight + window.scrollY) + this.props.loadBeforeScrollEnd;

    if (currentWindowHeight >= document.body.offsetHeight && isLastDataSource) {
      this.props.fetchNextPageAnimeList();
    }
  }

  setPrevPageDataSource = () => {
    const isScrollDirectionTop = window.scrollY < this.lastScrollTop;
    const currentScrollPosition = window.scrollY - this.props.loadBeforeScrollEnd;

    if (isScrollDirectionTop && currentScrollPosition <= 0) {   
      let firstDataSource =  this.state.dataSource[0];
      let { animes } = this.props;

      if (firstDataSource.id === animes[0].id){
        return;        
      }

      let firstElementIndex = 
        animes.findIndex(element => element.id === firstDataSource.id);

      let lastIndex = firstElementIndex - 1;
      let startIndex = firstElementIndex - this.props.dataSourceLimit;

      startIndex = startIndex < 0 ? 0 : startIndex;

      let newDataSource = animes.slice(startIndex, lastIndex);
      window.scrollTo(0, document.body.scrollHeight);
      this.setState({dataSource: newDataSource});
    }

    this.lastScrollTop = window.scrollY;
  }

  /** Fech the next page if is in the end of the limit of the scrool setup in the option */
  handleScroll = () => {
    this.fetchNextPageAnime();
    this.setPrevPageDataSource();
  }

  /** Fech the next page if this function is trigger */
  handleLoadMore = () => this.props.fetchNextPageAnimeList();

  render = () => {
    const { infiniteScroll, isFeching } = this.props;
    console.log(this.state.dataSource);
    return (
      <GridContainer>
        <AnimeGridList animes={this.state.dataSource} />
        <LoadMoreContainer>
          {isFeching && <CircularProgressStyle />}
          {!isFeching && !infiniteScroll && <RaisedButton onClick={this.handleLoadMore} label="Load More Animes" primary />}
        </LoadMoreContainer>
      </GridContainer>
    );
  }
}

export default AnimeGrid;
