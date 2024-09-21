
export default {

    getScopesPtab : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('scopes-ptab') 
                
                ? state.lists = JSON.parse(localStorage.getItem('scopes-ptab'))

                : []
    },
}