
export default {

    GET_AUTHENTICATE_USER : state => {

        return state.authenticateUser

                ? state.authenticateUser

                : localStorage.getItem('authenticateUser')

                ? JSON.parse(localStorage.getItem('authenticateUser')) !== undefined ? state.authenticateUser = JSON.parse(localStorage.getItem('authenticateUser'))

                : null

                : null
    },


    GET_ACCESS_TOKEN : state => {

        return state.access_token 

                ? state.access_token

                : localStorage.getItem('access_token')

                ? JSON.parse(localStorage.getItem('access_token')) !== undefined ? state.access_token = JSON.parse(localStorage.getItem('access_token'))

                : null

                : null
    },

    IS_AUTHENTICATED : (getters, state) => {
        return getters.GET_ACCESS_TOKEN ? true : null;
    },

}