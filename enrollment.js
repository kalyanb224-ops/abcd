document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('enrollment-form');
  const steps = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.step-indicator');
  const progressBar = document.getElementById('step-progress-bar');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnSubmit = document.getElementById('btn-submit');
  
  let currentStep = 1;
  const totalSteps = steps.length;

  // 1. STEP NAVIGATION AND PROGRESS BAR UPDATE
  const updateFormSteps = () => {
    // Show/hide form content blocks
    steps.forEach(step => {
      if (parseInt(step.getAttribute('data-step')) === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update Progress Indicators
    indicators.forEach(indicator => {
      const stepVal = parseInt(indicator.getAttribute('data-step'));
      if (stepVal < currentStep) {
        indicator.classList.add('completed');
        indicator.classList.remove('active');
      } else if (stepVal === currentStep) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    });

    // Update progress bar connecting line width
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = progressPercent + '%';

    // Show/hide navigation buttons
    if (currentStep === 1) {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'inline-flex';
      btnSubmit.style.display = 'none';
    } else if (currentStep === totalSteps) {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'inline-flex';
    } else {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'inline-flex';
      btnSubmit.style.display = 'none';
    }
  };

  // 2. VALIDATION PER STEP
  const validateStep = (stepNumber) => {
    const activeStepContainer = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const inputs = activeStepContainer.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      // Clear previous error styles
      input.style.borderColor = '';
      
      if (!input.checkValidity()) {
        isValid = false;
        input.style.borderColor = '#e11d48'; // highlight invalid in red
        
        // Shake animation effect for bad inputs
        input.animate([
          { transform: 'translateX(0px)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(4px)' },
          { transform: 'translateX(0px)' }
        ], { duration: 300 });
      }
    });

    // Custom check for file uploads in Step 3
    if (stepNumber === 3) {
      const birthCert = document.getElementById('birth-cert');
      const transcript = document.getElementById('report-card');
      const termsAgree = document.getElementById('terms-agree');
      
      if (!birthCert.files || birthCert.files.length === 0) {
        isValid = false;
        document.getElementById('birth-cert').parentElement.style.borderColor = '#e11d48';
      }
      
      if (!transcript.files || transcript.files.length === 0) {
        isValid = false;
        document.getElementById('report-card').parentElement.style.borderColor = '#e11d48';
      }
      
      if (!termsAgree.checked) {
        isValid = false;
        termsAgree.parentElement.style.color = '#e11d48';
        setTimeout(() => { termsAgree.parentElement.style.color = ''; }, 3000);
      }
    }

    return isValid;
  };

  // 3. EVENT LISTENERS FOR CONTROLS
  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateFormSteps();
      window.scrollTo({ top: document.querySelector('.step-progress').offsetTop - 120, behavior: 'smooth' });
    }
  });

  btnPrev.addEventListener('click', () => {
    currentStep--;
    updateFormSteps();
    window.scrollTo({ top: document.querySelector('.step-progress').offsetTop - 120, behavior: 'smooth' });
  });

  // 4. UPLOAD BOX HANDLERS
  const setupFileUpload = (inputId, displayNameId) => {
    const fileInput = document.getElementById(inputId);
    const nameDisplay = document.getElementById(displayNameId);
    
    fileInput.addEventListener('change', () => {
      // Clear error borders
      fileInput.parentElement.style.borderColor = '';
      
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Shorten filename if too long
        let fileName = file.name;
        if (fileName.length > 25) {
          fileName = fileName.substring(0, 18) + '...' + fileName.split('.').pop();
        }
        nameDisplay.innerText = fileName + ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        nameDisplay.style.color = '#D4AF37'; // gold highlight for successful selection
        fileInput.parentElement.style.borderColor = '#D4AF37';
      } else {
        nameDisplay.innerText = 'No file selected';
        nameDisplay.style.color = '';
      }
    });
  };

  setupFileUpload('birth-cert', 'birth-cert-name');
  setupFileUpload('report-card', 'report-card-name');

  // 5. DYNAMIC FEE ESTIMATION
  const targetGradeSelect = document.getElementById('target-grade');
  const feeBasisText = document.getElementById('fee-basis-text');
  const feeBasisAmount = document.getElementById('fee-basis-amount');

  const updateFeeEstimate = () => {
    const selectedGrade = targetGradeSelect.value;
    
    if (!selectedGrade) {
      feeBasisText.innerText = 'Based on target class: Please select a grade in Step 1';
      feeBasisAmount.innerText = '$0';
      return;
    }

    const gradeVal = parseInt(selectedGrade);
    let fee = 0;
    let levelName = '';

    if (gradeVal >= 1 && gradeVal <= 5) {
      fee = 8500;
      levelName = `Primary School (Grade ${gradeVal})`;
    } else if (gradeVal >= 6 && gradeVal <= 8) {
      fee = 10500;
      levelName = `Middle School (Grade ${gradeVal})`;
    } else if (gradeVal >= 9 && gradeVal <= 12) {
      fee = 13500;
      levelName = `High School (Grade ${gradeVal})`;
    }

    feeBasisText.innerText = `Based on selected grade: ${levelName} curriculum`;
    feeBasisAmount.innerText = `$${fee.toLocaleString()}`;
    
    // Smooth scaling animation on amount change
    feeBasisAmount.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.15)' },
      { transform: 'scale(1)' }
    ], { duration: 300 });
  };

  targetGradeSelect.addEventListener('change', updateFeeEstimate);

  // 6. SUBMIT ENROLLMENT HANDLING
  const toast = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');

  const showToast = (message) => {
    toastMsg.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    const studentName = document.getElementById('student-name').value;
    const selectedGrade = targetGradeSelect.options[targetGradeSelect.selectedIndex].text;

    // Trigger loading state for submit button
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Application...';
    btnPrev.disabled = true;

    setTimeout(() => {
      // Simulate success response
      showToast(`Admissions open! Application for ${studentName} (applying for ${selectedGrade}) submitted successfully!`);
      
      // Reset form
      form.reset();
      
      // Reset uploads visual markers
      document.getElementById('birth-cert-name').innerText = 'No file selected';
      document.getElementById('birth-cert-name').style.color = '';
      document.getElementById('birth-cert').parentElement.style.borderColor = '';
      
      document.getElementById('report-card-name').innerText = 'No file selected';
      document.getElementById('report-card-name').style.color = '';
      document.getElementById('report-card').parentElement.style.borderColor = '';

      updateFeeEstimate(); // resets amount to 0

      // Re-enable and reset steps
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Submit Enrollment <i class="fa-solid fa-check"></i>';
      btnPrev.disabled = false;
      
      currentStep = 1;
      updateFormSteps();
      
      // Scroll to top of section
      window.scrollTo({ top: document.querySelector('.enrollment-banner').offsetTop, behavior: 'smooth' });
    }, 2000);
  });

});
