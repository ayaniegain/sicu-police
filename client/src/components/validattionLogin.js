const validate = (values) => {
    const errors = {};
  
    // Police Station Name validation
    if (!values.policeStationName) {
      errors.policeStationName = 'Police station name is required';
    } else if (values.policeStationName.length < 4) {
      errors.policeStationName = 'Police station name should be more than 4 characters';
    }
  
    // Email validation
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
  
    // Password validation
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
    } 
    // else if (!/[A-Z]/.test(values.password)) {
    //   errors.password = 'Password should contain at least one uppercase letter';
    // } else if (!/[a-z]/.test(values.password)) {
    //   errors.password = 'Password should contain at least one lowercase letter';
    // } else if (!/[0-9]/.test(values.password)) {
    //   errors.password = 'Password should contain at least one number';
    // } else if (!/[!@#$%^&*]/.test(values.password)) {
    //   errors.password = 'Password should contain at least one special character';
    // }
  
    // Special Code validation
    if (!values.specialCode) {
      errors.specialCode = 'Special code is required';
    } else if (values.specialCode.length !== 6) {
      errors.specialCode = 'Special code should be exactly 6 characters long';
    }
  
    return errors;
  };
  
  export default validate;
  