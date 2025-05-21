import { useState } from 'react'
import style from '../authorization/Register.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Button from '../../components/Buttons/Button'
import { GrLinkNext } from "react-icons/gr";
import { useNavigate } from 'react-router'


type Metrics = { 
    weight: number,
    height: number,
    sex: string,
    age: number
}
export const Metrics = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        weight: 70,
        height: 180,
        sex: '',
        age: 20
    })
    const { mutate: addMetrics } = useMutation({
        mutationFn: async ({ weight, height, sex, age }: Metrics) => {
            const res = await axios.patch('http://localhost:5000/api/user/add-metrics', { weight, height, sex, age }, { withCredentials: true });
            return res;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['authUser']});
            navigate('/plan');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Помилка");
        }
    })

    const handleFormInput = (e: {target: { name: any; value: any } }) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleButton = () => {
        addMetrics(formData);
    }
  return (
    <div className={style.page}>
        <h1 style={{marginTop: "50px"}}>Ваші параметри</h1>
        <div className={style.content}>
            <h2>Вага</h2>
            <input type="number" name='weight' onChange={handleFormInput} value={formData.weight}/>
            <h2>Ріст</h2>
            <input type="number" name='height' onChange={handleFormInput} value={formData.height}/>
            <h2>Вік</h2>
            <input type="number" name='age' onChange={handleFormInput} value={formData.age}/>
            <h2>Стать</h2>
            <select name="sex" id='sex' onChange={handleFormInput}>
                <option value="">-- Виберіть стать --</option>
                <option value="male">Чоловік</option>
                <option value="female">Жінка</option>
            </select>
            <Button onClick={handleButton}>Далі<GrLinkNext /></Button>
        </div>
        <Toaster/>
    </div>
  )
}
