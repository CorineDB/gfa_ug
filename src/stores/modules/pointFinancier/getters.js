export default {

    getPointFinancier : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('pointFinancier') 
                
                ? state.lists = JSON.parse(localStorage.getItem('pointFinancier'))

                : []
    },
}