import {configureStore} from '@reduxjs/toolkit';

// slicess from local slice...
import UserRegReducer from './RegisterUser';
import AnonReducer from './AnonymousUser';
import AnnonMessReducer from './AnnonymousMessages';
import AnnonDesReducer from './AnnonDesslice';
import UserReducer from './AuthUser';
import ContactReducer from './ContactSlice'
const store=configureStore({
    reducer:{
        UserReg:UserRegReducer,
        AnnRecip:AnonReducer,
        AnnonMess:AnnonMessReducer,
        AnnonDes:AnnonDesReducer,
        User:UserReducer,
        Contact:ContactReducer
    },
});

export default store;
