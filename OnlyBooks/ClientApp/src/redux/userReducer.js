const initialState = {
    user: null, 
    totalPrice: 0,
};

export const actionTypes = {
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',
    UPDATE_USER: 'UPDATE_USER',
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                user: null,
            };
        case actionTypes.UPDATE_USER: 
            return {
                ...state,
                user: { ...state.user, ...action.payload }, 
            };
        default:
            return state;
    }
};

export const setUser = (user) => {
    console.log('Setting user:', user);
    return {
        type: actionTypes.SET_USER,
        payload: user,
    };
};

export const logout = () => ({
    type: actionTypes.LOGOUT,
});

export const updateUser = (updatedData) => ({
    type: actionTypes.UPDATE_USER,
    payload: updatedData,
});
