
import User from '@/store/modules/users/user'

export default class Institution extends User{
    constructor (institution = {})
    {
        super(institution);
    }
}