const loginReducer = (prevState, action) => {
    switch(action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          id: action.id,
          token: action.token,
          isLoading: false
        }
      case "LOGIN":
        return {
          ...prevState,
          id: action.id,
          email: action.email,
          token: action.token,
          isLoading: false
        }
      case "LOGOUT":
        return {
          ...prevState,
          id: null,
          email: null,
          token: null,
          isLoading: false
        }
      case "REGISTER":
        return {
          ...prevState,
          id: action.id,
          name: action.name,
          email: action.email,
          token: action.token,
          isLoading: false
        }
      case "RESET_PASSWORD":
        return {
          ...prevState,
          id: action.id,
          name: action.name,
          email: action.email,
          token: action.token,
          isLoading: false
        }  
    }
  }
  
  export {loginReducer}