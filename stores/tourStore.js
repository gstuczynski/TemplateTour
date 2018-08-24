import alt from '../alt';
import TourActions from '../actions/tourActions'

class TourStore {
  constructor(){
    this.state = {
      isFetching: true,
      step: null,
    };
    this.bindActions(TourActions);
    this.exportPublicMethods({
      getStepData: this.getStepData,
      isFetching: this.isFetching,
    });
  }

  getStepData() {
      return this.state.step;
  }

  isFetching() {
    return this.state.isFetching;
  }

  onNavigateTo() {
    this.setState({ isFetching: true })
  }

  onNavigateToError(error){
      //todo
  }

  onNavigateToSuccess(step) {
    console.log(step);
    this.setState({ step, isFetching: false })
  }

}
export default alt.createStore(TourStore, 'TourStore');
