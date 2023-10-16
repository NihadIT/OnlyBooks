import { createStore, combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { favoriteReducer } from './favoriteReducer';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    auth: userReducer,
    favorite: favoriteReducer
});

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cartState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cartState', serializedState);
    } catch {
        // ignore write errors
    }
};

const persistedState = loadState();

const store = createStore(
    rootReducer,
    persistedState // Загружаем состояние из localStorage
);

store.subscribe(() => {
    saveState(store.getState()); // Сохраняем состояние в localStorage при каждом изменении
});

export default store;
