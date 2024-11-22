import {configureStore} from '@reduxjs/toolkit';

// slicess from local slice...
import UserRegReducer from './RegisterUser';
import AnonReducer from './AnonymousUser';
import AnnonMessReducer from './AnnonymousMessages';
const store=configureStore({
    reducer:{
        UserReg:UserRegReducer,
        AnnRecip:AnonReducer,
        AnnonMess:AnnonMessReducer,
    },
});

export default store;
