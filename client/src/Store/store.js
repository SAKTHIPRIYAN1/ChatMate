import {configureStore} from '@reduxjs/toolkit';

// slicess from local slice...
import UserRegReducer from './RegisterUser';
import AnonReducer from './AnonymousUser';
import AnnonMessReducer from './AnnonymousMessages';
import AnnonDesReducer from './AnnonDesslice';
const store=configureStore({
    reducer:{
        UserReg:UserRegReducer,
        AnnRecip:AnonReducer,
        AnnonMess:AnnonMessReducer,
        AnnonDes:AnnonDesReducer,
    },
});

export default store;
