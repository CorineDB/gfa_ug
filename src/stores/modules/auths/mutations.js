export default {

    SET_AUTH_DATA(state, user) {
        localStorage.setItem('authenticateUser', JSON.stringify(user))
        state.authenticateUser = user
    },

    SET_ACCESS_TOKEN (state, access_token) {
        let token = access_token
       
        const nbre = Math.floor(Math.random() * 9);
        token = token +''+ nbre
        localStorage.setItem('access_token', JSON.stringify(token))
        state.access_token = token
    },

    RESET_AUTH_DATA(state) {    
        
        if( localStorage.key("authenticateUser") )
            localStorage.removeItem('authenticateUser')

        if( localStorage.key("access_token") )
            localStorage.removeItem('access_token')

        state.access_token = null

        state.authenticateUser = null
        
    },
};
