//** Import Redux
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//** Import ProcedureNames
import RemoteProcedureNames from '../../util/RemoteProcedureNames';
import { string } from 'prop-types';


//** Create userSlice
export const widgetMenuSlice = createSlice({
    name: 'widgetMenu',
    initialState: {
        menuFontSize: 10,
        position: null,
        fontFamily: 'Inter',

    },
    reducers: {
        handleChangeFontSize(state, action) {
            state.menuFontSize = action.payload;
        },
        handleChangeMenuPosition(state, action){
            state.position=action.payload;
        },
        handleChangeFontFamily(state, action){
            state.fontFamily=action.payload;
        }
    }
});

export const {
    handleChangeFontSize,
    handleChangeMenuPosition,
    handleChangeFontFamily,
} = widgetMenuSlice.actions
export default widgetMenuSlice;


