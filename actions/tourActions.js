import alt from '../alt';

class TourActions {

  constructor() {
    this.generateActions('navigateToError', 'navigateToSuccess')
  }

  navigateTo(step) {
    return(dispatch) => {
      dispatch();
      fetch('../tour_config/' + step + '.json').then(response => {
        if (!response.ok) {
          this.navigateToError(response.body);
        } else {
          response.json().then(data => {
            this.navigateToSuccess(data)
          })
        }
      }).catch(error => {
        this.navigateToError(error)
      })
    };
  }
}

export default alt.createActions(TourActions);
