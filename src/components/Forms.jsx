import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './Index.css'

const Forms = () => {
  const { register, formState: { errors }, handleSubmit, reset, setValue } = useForm();
  const [formDatas, setFormDatas] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [filters, setFilters] = useState({ categoria: '', fecha: '', monto: '' });

  const onSubmit = (data) => {
    if (editIndex !== null) {
      const updatedFormDatas = [...formDatas];
      updatedFormDatas[editIndex] = data;
      setFormDatas(updatedFormDatas);
      setEditIndex(null);
    } else {
      setFormDatas([...formDatas, data]);
    }
    reset(); // Resetea el formulario después de enviar
  };

  const onEdit = (index) => {
    setEditIndex(index);
    const data = formDatas[index];
    setValue('descripcion', data.descripcion);
    setValue('categoria', data.categoria);
    setValue('monto', data.monto);
    setValue('fecha', data.fecha);
  };

  const handleDelete = (index) => {
    const updatedFormDatas = formDatas.filter((_, i) => i !== index);
    setFormDatas(updatedFormDatas);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredData = formDatas.filter((data) => {
    return (
      (filters.categoria ? data.categoria === filters.categoria : true) &&
      (filters.fecha ? data.fecha === filters.fecha : true) &&
      (filters.monto ? data.monto === parseInt(filters.monto) : true)
    );
  });

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <h2>Formulario</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control"
                {...register('descripcion', {
                  required: true,
                  maxLength: 200,
                })}
              />
              {errors.descripcion?.type === 'required' && (
                <p className="text-danger">El campo es requerido</p>
              )}
              {errors.descripcion?.type === 'maxLength' && (
                <p className="text-danger">El campo debe tener menos de 200 caracteres</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select className="form-select" {...register('categoria')}>
                <option value="pa">Pagado</option>
                <option value="no">No Pagado</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input type="number" className="form-control" {...register('monto')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" {...register('fecha')} />
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>

          <h2 className="mt-5">Filtros</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select className="form-select" name="categoria" onChange={handleFilterChange}>
                <option value="">Todas</option>
                <option value="pa">Pagado</option>
                <option value="no">No Pagado</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" name="fecha" onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input type="number" className="form-control" name="monto" onChange={handleFilterChange} />
            </div>
          </form>
        </div>

        <div className="col-md-8">
          <div className="row">
            {filteredData.map((formData, index) => (
              <div key={index} className="col-md-6">
                <div className="card mt-3 position-relative">
                  <div className="card-body d-flex flex-column">
                    <button 
                      type="button" 
                      className="btn-close position-absolute top-0 end-0" 
                      aria-label="Close" 
                      onClick={() => handleDelete(index)}
                    ></button>
                    <h5 className="card-title">Información Guardada</h5>
                    <p className="card-text"><strong>Descripción:</strong> {formData.descripcion}</p>
                    <p className="card-text"><strong>Monto:</strong> {formData.monto}</p>
                    <p className="card-text"><strong>Fecha:</strong> {formData.fecha}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <button className="btn btn-secondary" onClick={() => onEdit(index)}>Editar</button>
                      <span className={`badge ${formData.categoria === 'pa' ? 'bg-success' : 'bg-danger'}`}>
                        {formData.categoria === 'pa' ? 'Pagado' : 'No Pagado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;
