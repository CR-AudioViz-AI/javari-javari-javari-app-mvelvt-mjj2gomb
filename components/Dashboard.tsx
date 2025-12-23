'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useForm } from 'react-hook-form';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

interface Expense {
  category: string;
  amount: number;
  date: string;
}

interface MonthlyData {
  month: string;
  total: number;
}

const Dashboard = () => {
  const { register, handleSubmit, reset } = useForm();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]); // categories data for PieChart
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]); // monthly data for LineChart

  const onSubmit = (data: { category: string; amount: string }) => {
    const newExpense = { category: data.category, amount: parseFloat(data.amount), date: new Date().toISOString().split('T')[0] };
    const newExpensesList = [...expenses, newExpense];
    setExpenses(newExpensesList);
    calculateCategoriesData(newExpensesList);
    calculateMonthlyData(newExpensesList);
    reset(); // reset form fields
  };

  // Group expenses by category and calculate sum
  const calculateCategoriesData = (expensesList: Expense[]) => {
    const totalByCategory = expensesList.reduce((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    const newData = Object.keys(totalByCategory).map((category) => ({
      name: category,
      value: totalByCategory[category],
    }));

    setCategoriesData(newData);
  };

  // Aggregate expenses monthly
  const calculateMonthlyData = (expensesList: Expense[]) => {
    const totalsByMonth = expensesList.reduce((acc, expense) => {
      const month = new Date(expense.date).getMonth();
      const year = new Date(expense.date).getFullYear();
      const monthYearKey = `${month}-${year}`;
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = { month: `${month + 1}/${year}`, total: 0 };
      }
      acc[monthYearKey].total += expense.amount;
      return acc;
    }, {});

    const newData = Object.values(totalsByMonth);
    setMonthlyData(newData);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold">Add Expense</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input {...register("category", { required: true })} className="border p-2" placeholder="Category" />
            <input {...register("amount", { required: true })} type="number" className="border p-2" placeholder="Amount" />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-bold">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={categoriesData} fill="#8884d8" label={(entry) => entry.name}>
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold">Monthly Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;