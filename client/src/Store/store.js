import {configureStore} from '@reduxjs/toolkit';

// slicess from local slice...
import UserRegReducer from './RegisterUser';
import AnonReducer from './AnonymousUser';

const store=configureStore({
    reducer:{
        UserReg:UserRegReducer,
        AnnRecip:AnonReducer,
    },
});

export default store;