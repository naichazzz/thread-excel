const selectedCarInfo = {
    state: {
        carInfo: ''
    },
    mutations: {
        selectedCarInfo(state, msg) {
            state.carInfo = msg
        }
    }
}
export default selectedCarInfo