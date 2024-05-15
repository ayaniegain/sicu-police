const validate = (values) => {
    const errors = {};
  
    // Police Station Name validation
    if (!values.psname) {
      errors.psname = 'Police station name is required';
    } else if (values.psname.length < 4) {
      errors.psname = 'Police station name should be more than 4 characters';
    }
  
    // Address validation
    if (!values.address) {
      errors.address = 'Address is required';
    } else if (values.address.length < 6) {
      errors.address = 'Address should be at least 6 characters long';
    }
  
    // Email validation
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
  
    // Phone Number validation
    if (!values.phno) {
      errors.phno = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phno)) {
      errors.phno = 'Phone number should be 10 digits';
    }
  
    // City validation
    if (!values.city) {
      errors.city = 'City is required';
    } else if (values.city.length < 3) {
      errors.city = 'City should be at least 3 characters long';
    }
  
    // Area of Action validation
    if (!values.areaofaction) {
      errors.areaofaction = 'Area of action is required';
    }
  
    // State validation
    if (!values.state) {
      errors.state = 'State is required';
    }
  
    // Officer Number validation
    if (!values.officerno) {
      errors.officerno = 'Officer number is required';
    }
  
    // Pincode validation
    if (!values.pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(values.pincode)) {
      errors.pincode = 'Pincode should be 6 digits';
    }
  
    // Password validation
    if (!values.createPassword) {
      errors.createPassword = 'Create password is required';
    } else if (values.createPassword.length < 6) {
      errors.createPassword = 'Password should be at least 6 characters long';
    }
    //  else if (!/[A-Z]/.test(values.createPassword)) {
    //   errors.createPassword = 'Password should contain at least one uppercase letter';
    // } else if (!/[a-z]/.test(values.createPassword)) {
    //   errors.createPassword = 'Password should contain at least one lowercase letter';
    // } else if (!/[0-9]/.test(values.createPassword)) {
    //   errors.createPassword = 'Password should contain at least one number';
    // } else if (!/[!@#$%^&*]/.test(values.createPassword)) {
    //   errors.createPassword = 'Password should contain at least one special character';
    // }
  
    // Confirm Password validation
    if (!values.password) {
      errors.password = 'Confirm password is required';
    } else if (values.password !== values.createPassword) {
      errors.password = 'Passwords do not match';
    }
  
    return errors;
  };
  
  export default validate;
  