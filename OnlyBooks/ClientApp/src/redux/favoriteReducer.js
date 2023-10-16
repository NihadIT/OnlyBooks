const initialState = {
    favorite: [],
};

export const actionTypes = {
    ADD_TO_FAVORITE: 'ADD_TO_FAVORITE',
    CLEAR_FAVORITE: 'CLEAR_FAVORITE',
    CLEAR_FAVORITE_ITEM: 'CLEAR_FAVORITE_ITEM',
};

export const favoriteReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_FAVORITE:
            const newItem = action.payload;
            const existingItem = state.favorite.find(item => item.id === newItem.id);
            if (existingItem) {
                // Если уже есть, не меняем состояние
                return state;
            } else {
                // Если товара нет в избранном, добавляем его
                return {
                    ...state,
                    favorite: [...state.favorite, newItem],
                };
            }

        case actionTypes.CLEAR_FAVORITE_ITEM:
            const bookIdToRemove = action.payload;
            const updatedFavorite = state.favorite.filter((item) => item.id !== bookIdToRemove);
            return {
                ...state,
                favorite: updatedFavorite,
            };
        case actionTypes.CLEAR_FAVORITE:
            return {
                favorite: [],
            };
       
        default:
            return state;
    }
};

export const addToFavorite = (item) => ({
    type: actionTypes.ADD_TO_FAVORITE,
    payload: item,
});

export const clearFavorite = () => ({
    type: actionTypes.CLEAR_FAVORITE
});

export const clearFavoriteItem = (item) => ({
    type: actionTypes.CLEAR_FAVORITE_ITEM,
    payload: item,
});

