import { useState } from 'react';
import './Login.scss';
import { toast } from 'react-toastify';
import { login } from '../api-service';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

function Login() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login(formData);
    if (res.error) {
      toast(`${res.message}`);
      setFormData(initialState);
    } else {
      const { token } = res;
      localStorage.setItem('token', token);
      navigate('/map');
    }
  }

  return (
    <section className='login-container'>
      <h1 className='login-title'> welcome back</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <input
          type='email'
          onChange={handleChange}
          value={formData.email}
          name='email'
          placeholder='Email'
          autoFocus
          required
        />
        <input
          type='password'
          onChange={handleChange}
          value={formData.password}
          name='password'
          placeholder='Password'
          autoComplete='off'
          required
        />
        <button className='login-form--btn'>login</button>
      </form>
    </section>
  );
}

export default Login;
