const IS_DEVELOP = process.env.NODE_ENV === "development";

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;