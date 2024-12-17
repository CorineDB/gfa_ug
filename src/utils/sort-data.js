
const sortBy = ({data = [], by = 'date', deep = null, param = 'created_at', options = {'order' : 'desc'}}) => {

    const sorter = (a, b) => {

        if(deep){ 
            a = a[deep]; 
            b = b[deep];
        }

        switch (by) {
            
            case 'date':

                if(options['order'] === 'asc')
                    return new Date(a[param]).getTime() - new Date(b[param]).getTime();

                else if(options['order'] === 'desc')
                    return new Date(b[param]).getTime() - new Date(a[param]).getTime();

                break;
            
            case 'id':

                if(options['order'] === 'asc')
                    return a[param] < b[param];

                else if(options['order'] === 'desc')
                    return a[param] > b[param];

                break;


            default:
                break;
        }
    }

    data.sort(sorter)

};

export default sortBy