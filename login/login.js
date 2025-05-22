// University Login Page - Complete JavaScript with fixed password toggle functionality

document.addEventListener('DOMContentLoaded', function() {
    // Setup password toggle functionality
    setupPasswordToggles();
    
    // Tab switching functionality
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    loginTab.addEventListener('click', function() {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.remove('hide');
      registerForm.classList.add('hide');
      
      // Animation
      loginForm.style.animation = 'fadeIn 0.5s forwards';
    });
  
    registerTab.addEventListener('click', function() {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.remove('hide');
      loginForm.classList.add('hide');
      
      // Animation
      registerForm.style.animation = 'fadeIn 0.5s forwards';
    });
  
    // Form validation
    const validateForm = (formId) => {
      const form = document.getElementById(formId);
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
          // Remove previous error state
          input.style.borderColor = '';
          
          if (input.hasAttribute('required') && !input.value.trim()) {
            // Handle required field validation
            input.style.borderColor = 'var(--danger-color)';
            showInputError(input, 'This field is required');
            isValid = false;
          } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            // Handle email validation
            input.style.borderColor = 'var(--danger-color)';
            showInputError(input, 'Please enter a valid email');
            isValid = false;
          } else if (input.id === 'confirm-password' && input.value !== document.getElementById('reg-password').value) {
            // Handle password confirmation
            input.style.borderColor = 'var(--danger-color)';
            showInputError(input, 'Passwords do not match');
            isValid = false;
          }
        });
        
        if (isValid) {
          // Show success message
          showMessage(formId === 'login-form' ? 'Login successful!' : 'Registration successful!', 'success');
          
          // Reset form (in real app, you'd handle form submission here)
          setTimeout(() => {
            form.reset();
          }, 1500);
        }
      });
    };
    
    // Validate both forms
    validateForm('login-form');
    validateForm('register-form');
    
    // Helper functions
    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    function showInputError(input, message) {
      // Remove any existing error message
      const parent = input.parentElement.parentElement;
      const existingError = parent.querySelector('.error-message');
      if (existingError) {
        parent.removeChild(existingError);
      }
      
      // Create error message element
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = 'var(--danger-color)';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.marginTop = '5px';
      errorDiv.style.animation = 'fadeIn 0.3s forwards';
      errorDiv.textContent = message;
      
      // Add error message to DOM
      parent.appendChild(errorDiv);
      
      // Remove error message after 3 seconds
      setTimeout(() => {
        if (parent.contains(errorDiv)) {
          errorDiv.style.animation = 'fadeOut 0.3s forwards';
          setTimeout(() => {
            if (parent.contains(errorDiv)) {
              parent.removeChild(errorDiv);
            }
          }, 300);
        }
      }, 3000);
    }
    
    function showMessage(message, type) {
      // Create message container if it doesn't exist
      let messageContainer = document.querySelector('.message-container');
      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.zIndex = '1000';
        document.body.appendChild(messageContainer);
      }
      
      // Create message element
      const messageEl = document.createElement('div');
      messageEl.className = `message ${type}`;
      messageEl.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--danger-color)';
      messageEl.style.color = 'white';
      messageEl.style.padding = '12px 20px';
      messageEl.style.borderRadius = '8px';
      messageEl.style.marginBottom = '10px';
      messageEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      messageEl.style.animation = 'slideIn 0.3s forwards';
      messageEl.textContent = message;
      
      // Add message to container
      messageContainer.appendChild(messageEl);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
          if (messageContainer.contains(messageEl)) {
            messageContainer.removeChild(messageEl);
          }
          
          // Remove container if empty
          if (messageContainer.children.length === 0) {
            document.body.removeChild(messageContainer);
          }
        }, 300);
      }, 3000);
    }
    
    // Animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transition = 'all 0.3s';
        this.parentElement.style.transform = 'translateY(-2px)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
      });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseover', function() {
        this.style.transition = 'all 0.3s';
        this.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    // Add field floating labels effect
    document.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input');
      const label = group.querySelector('label');
      
      if (!input || !label) return;
      
      input.addEventListener('focus', () => {
        label.style.transition = 'all 0.3s';
        label.style.color = 'var(--primary-color)';
      });
      
      input.addEventListener('blur', () => {
        label.style.color = '';
      });
    });
  });
  
  // Setup password toggle functionality for all password fields
  function setupPasswordToggles() {
    // Get all password fields
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
      // Add a class to the parent container for styling
      field.parentElement.classList.add('password-field');
      
      // Create the eye icon button
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button'; // Prevent form submission
      toggleBtn.className = 'password-toggle';
      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
      
      // Add the button to the input field's parent
      field.parentElement.appendChild(toggleBtn);
      
      // Add click event to toggle visibility
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default button behavior
        
        // Toggle between password and text type
        if (field.type === 'password') {
          field.type = 'text';
          this.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Change to "hide" icon
        } else {
          field.type = 'password';
          this.innerHTML = '<i class="fas fa-eye"></i>'; // Change to "show" icon
        }
      });
    });
  }