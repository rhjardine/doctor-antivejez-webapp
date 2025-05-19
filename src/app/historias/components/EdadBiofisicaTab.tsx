'use client'; // Indicar que es un Client Component por usar Hooks (useState, useEffect)

import React, { useState, useEffect, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BiofisicaField, GENDER_OPTIONS, getFatName } from '../types/biofisica'; // Ajusta la ruta
import { getAbsoluteResult, getDimensionsResult, getTextForDifferential } from '@/utils/biofisicaCalculations';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Componente Principal ---
const EdadBiofisicaTab: React.FC = () => {
    // --- Estado del Componente ---
    const [chronologicalAge, setChronologicalAge] = useState<number | ''>('');
    const [gender, setGender] = useState<number | ''>('');
    const [fields, setFields] = useState<BiofisicaField[]>([]);
    const [biologicalAge, setBiologicalAge] = useState<number | null>(null);
    const [differentialAge, setDifferentialAge] = useState<number | null>(null);
    const [isCalculated, setIsCalculated] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({}); // Para errores de validación

    // --- Inicialización y Actualización de Campos basada en Género ---
    const initializeFields = useCallback((selectedGender: number | '') => {
        if (!selectedGender) {
            setFields([]);
            return;
        }
        const fatName = getFatName(selectedGender);
        if (!fatName) {
             setFields([]);
             return;
        }

        // Definir la estructura base de los campos
        const initialFields: BiofisicaField[] = [
            { name: fatName, translate: '% Grasa', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'body_mass', translate: 'Índice de masa corporal (IMC)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'digital_reflections', translate: 'Reflejos Digitales - Promedio (cm)', dimensions: true, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'visual_accommodation', translate: 'Acomodación Visual (cm)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'static_balance', translate: 'Balance Estático - Promedio (seg)', dimensions: true, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'quaten_hydration', translate: 'Hidratación Cutánea (seg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'systolic_blood_pressure', translate: 'Sistólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
            { name: 'diastolic_blood_pressure', translate: 'Diastólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
        ];
        setFields(initialFields);
        setBiologicalAge(null);
        setDifferentialAge(null);
        setIsCalculated(false);
        setErrors({}); // Limpiar errores al cambiar género
    }, []);

    // Efecto para inicializar campos cuando cambia el género
    useEffect(() => {
        initializeFields(gender);
    }, [gender, initializeFields]);

    // --- Manejadores de Eventos ---
    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGender(e.target.value ? parseInt(e.target.value, 10) : '');
    };

    const handleChronologicalAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChronologicalAge(e.target.value ? parseInt(e.target.value, 10) : '');
        setIsCalculated(false); // Resetear estado de cálculo si cambia la edad
    };

    const handleFieldChange = (
        fieldName: string,
        valueType: 'relative_value' | 'high' | 'long' | 'width',
        value: string
    ) => {
        const numericValue = value === '' ? '' : parseFloat(value); // Mantener '' o convertir a número

        setFields(prevFields =>
            prevFields.map(field =>
                field.name === fieldName
                    ? { ...field, [valueType]: numericValue }
                    : field
            )
        );
        setIsCalculated(false); // Resetear estado de cálculo si cambian los inputs
        // Limpiar error específico de este campo si el usuario empieza a escribir
        if (errors[fieldName]) {
             setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
        if (errors.chronologicalAge && valueType === 'relative_value') { // Asumiendo que cualquier cambio resetea el error general
             setErrors(prev => ({ ...prev, chronologicalAge: '' }));
        }
         if (errors.gender && valueType === 'relative_value') {
             setErrors(prev => ({ ...prev, gender: '' }));
         }
    };

    const validateForm = (): boolean => {
         const newErrors: Record<string, string> = {};
         let isValid = true;

         if (!chronologicalAge && chronologicalAge !== 0) {
             newErrors.chronologicalAge = 'Edad Cronológica requerida.';
             isValid = false;
         }
         if (!gender) {
             newErrors.gender = 'Género requerido.';
             isValid = false;
         }

         fields.forEach(field => {
             if (field.dimensions) {
                 if ((!field.high && field.high !== 0) || (!field.long && field.long !== 0) || (!field.width && field.width !== 0)) {
                     newErrors[field.name] = `${field.translate} requiere Alto, Largo y Ancho.`;
                     isValid = false;
                 }
             } else {
                 if (!field.relative_value && field.relative_value !== 0) {
                     newErrors[field.name] = `${field.translate} requerido.`;
                     isValid = false;
                 }
             }
         });

         setErrors(newErrors);
         return isValid;
     };

    const handleCalculate = () => {
        if (!validateForm()) {
             console.log("Errores de validación:", errors);
             return;
        }

        let absoluteSum = 0;
        let validFieldsCount = 0;
        const updatedFields = fields.map(field => {
            try {
                const absolute_value = field.dimensions
                    ? getDimensionsResult(field)
                    : getAbsoluteResult(field.name, field.relative_value);

                if (typeof absolute_value === 'number' && !isNaN(absolute_value)) {
                    absoluteSum += absolute_value;
                    validFieldsCount++;
                } else {
                     console.warn(`Invalid absolute value calculated for ${field.name}: ${absolute_value}`);
                }
                return { ...field, absolute_value };
            } catch (error) {
                 console.error(`Error calculating absolute value for ${field.name}:`, error);
                 return { ...field, absolute_value: null }; // Marcar como nulo en caso de error
            }
        });

        setFields(updatedFields); // Actualizar estado con los valores absolutos calculados

        if (validFieldsCount > 0 && chronologicalAge !== '') {
            const bioAge = absoluteSum / validFieldsCount;
            setBiologicalAge(bioAge);
            setDifferentialAge(bioAge - chronologicalAge);
            setIsCalculated(true);
        } else {
            setBiologicalAge(null);
            setDifferentialAge(null);
            setIsCalculated(false);
            // Podrías añadir un error general si no se calculó nada
            setErrors(prev => ({ ...prev, calculation: "No se pudieron calcular edades válidas." }));
        }
    };

    const handleSave = () => {
        // Aquí iría la lógica para enviar los datos a tu API backend
        const dataToSave = {
            chronologicalAge,
            gender,
            biologicalAge,
            differentialAge,
            fields: fields.map(({ name, translate, dimensions, relative_value, high, long, width, absolute_value }) => ({
                name,
                translate,
                dimensions,
                relative_value: relative_value !== '' ? relative_value : null, // Enviar null si está vacío
                high: high !== '' ? high : null,
                long: long !== '' ? long : null,
                width: width !== '' ? width : null,
                absolute_value
            }))
            // Probablemente necesites enviar también el ID del paciente
            // patientId: currentPatientId // (Necesitarías obtener esto de algún contexto o prop)
        };
        console.log('Datos para guardar:', JSON.stringify(dataToSave, null, 2));
        alert('Formulario calculado listo para ser guardado (ver consola para detalles).');
        // Simular deshabilitar botón tras guardar (en una app real, esperar respuesta API)
        // setIsCalculated(false); // O podrías tener un estado 'isSaved'
    };

    const handleBack = () => {
        // Lógica para volver atrás o resetear, según necesidad de la UI principal
        // Por ahora, reseteamos el estado local
        if (window.confirm('¿Estás seguro de que quieres resetear el formulario? Se perderán los datos no guardados.')) {
             setChronologicalAge('');
             setGender('');
             setFields([]);
             setBiologicalAge(null);
             setDifferentialAge(null);
             setIsCalculated(false);
             setErrors({});
        }
    };


    // --- Opciones y Datos para Gráficos ---
    // Opciones comunes para todos los gráficos de barras horizontales
    const commonChartOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: false, // Empezar desde la edad mínima posible
                min: 20,
                max: 100, // O un máximo razonable
                title: { display: true, text: 'Edad (años)', font: { size: 10 } },
                ticks: { font: { size: 8 }, stepSize: 10 }
            },
            y: { ticks: { display: false } } // Ocultar etiquetas del eje Y
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgb(41, 59, 100)', // Color secundario de tu tema original
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.x !== null) {
                            label += `${context.parsed.x.toFixed(0)} años`;
                        }
                        return label;
                    }
                }
            }
        },
        animation: {
             duration: 500 // Una pequeña animación al actualizar
        }
    };

    // --- Renderizado del Componente ---
    return (
        // Usamos flex/grid de Tailwind para replicar el layout original
        <div className="flex flex-col lg:flex-row gap-5 p-4 bg-gray-50 dark:bg-gray-800">
            {/* Columna Izquierda: Formulario */}
            <div className="w-full lg:w-1/2 bg-secondary-dark text-white p-6 rounded-lg shadow-md"> {/* Asumiendo bg-secondary-dark como tu color azul oscuro */}
                 <h2 className="text-xl font-semibold mb-6 border-b border-primary pb-2 text-primary">Test Edad Biofísica</h2> {/* Asumiendo text-primary como tu azul claro */}

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {/* Edad Cronológica */}
                    <div className="form-group">
                        <label htmlFor="chronological" className="block font-medium mb-1 text-sm">Edad Cronológica</label>
                        <input
                            type="number"
                            id="chronological"
                            name="chronological"
                            value={chronologicalAge}
                            onChange={handleChronologicalAgeChange}
                            placeholder="e.g. 50"
                            required
                            className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary ${errors.chronologicalAge ? 'border-red-500' : 'border-primary/30'}`}
                        />
                         {errors.chronologicalAge && <p className="text-red-400 text-xs mt-1">{errors.chronologicalAge}</p>}
                    </div>

                    {/* Género */}
                    <div className="form-group">
                        <label htmlFor="gender" className="block font-medium mb-1 text-sm">Género</label>
                        <select
                            id="gender"
                            name="gender"
                            value={gender}
                            onChange={handleGenderChange}
                            required
                            className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary appearance-none bg-no-repeat bg-right ${errors.gender ? 'border-red-500' : 'border-primary/30'}`}
                             style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23212b36' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }} // Estilo flecha dropdown
                        >
                            <option value="">Seleccione...</option>
                            {GENDER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                         {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    {/* Campos Dinámicos */}
                    <div id="dynamic-fields-container" className="space-y-4 pt-4 border-t border-primary/30">
                        {fields.map((field) => (
                            <div key={field.name} className="form-group" data-field-name={field.name}>
                                <label className="block font-medium mb-1 text-sm">{field.translate}</label>
                                {field.dimensions ? (
                                    // Inputs para Alto, Largo, Ancho + Resultado
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="number"
                                                name={`${field.name}_high`}
                                                value={field.high}
                                                onChange={(e) => handleFieldChange(field.name, 'high', e.target.value)}
                                                placeholder="Alto" required step="0.01"
                                                className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                                            />
                                            <input
                                                type="number"
                                                name={`${field.name}_long`}
                                                value={field.long}
                                                onChange={(e) => handleFieldChange(field.name, 'long', e.target.value)}
                                                placeholder="Largo" required step="0.01"
                                                className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                                            />
                                            <input
                                                type="number"
                                                name={`${field.name}_width`}
                                                value={field.width}
                                                onChange={(e) => handleFieldChange(field.name, 'width', e.target.value)}
                                                placeholder="Ancho" required step="0.01"
                                                className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            disabled
                                            name={`${field.name}_absolute`}
                                            value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                                            placeholder="Edad Calculada"
                                            className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                ) : (
                                    // Input Relativo + Resultado
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            name={`${field.name}_relative`}
                                            value={field.relative_value}
                                            onChange={(e) => handleFieldChange(field.name, 'relative_value', e.target.value)}
                                            placeholder="Valor" required step="0.01"
                                            className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                                        />
                                        <input
                                            type="text"
                                            disabled
                                            name={`${field.name}_absolute`}
                                            value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                                            placeholder="Edad Calculada"
                                            className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                )}
                                 {errors[field.name] && <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>}
                            </div>
                        ))}
                    </div>

                     {/* Resultados Finales */}
                    {fields.length > 0 && ( // Solo mostrar si hay campos (género seleccionado)
                        <div className="final-results grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-primary/10 p-4 rounded">
                            <div className="form-group">
                                <label className="block font-medium mb-1 text-sm">Edad Biofísica (Calculada)</label>
                                <input type="text" disabled value={biologicalAge !== null ? biologicalAge.toFixed(0) : '---'}
                                    className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed font-semibold" />
                            </div>
                            <div className="form-group">
                                <label className="block font-medium mb-1 text-sm">Edad Diferencial (Calculada)</label>
                                <input type="text" disabled
                                    value={differentialAge !== null ? `${Math.abs(differentialAge).toFixed(0)}${getTextForDifferential(differentialAge)}` : '---'}
                                    className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed font-semibold" />
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="buttons flex flex-wrap gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCalculate}
                            disabled={!gender || !chronologicalAge} // Deshabilitado si falta género o edad cronológica
                            className="flex-1 min-w-[100px] px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                        >
                            Calcular
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!isCalculated} // Deshabilitado hasta que se calcule
                            className="flex-1 min-w-[100px] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 min-w-[100px] px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-secondary-dark transition duration-150 ease-in-out"
                        >
                            Resetear {/* Cambiado de Volver a Resetear para claridad */}
                        </button>
                    </div>
                </form>
            </div>

            {/* Columna Derecha: Gráficos */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-3">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Resultados Gráficos por Métrica</h3>
                {fields.length === 0 && gender && (
                    <p className="text-gray-500 dark:text-gray-400">Seleccione métricas o revise la configuración.</p>
                )}
                 {fields.length === 0 && !gender && (
                    <p className="text-gray-500 dark:text-gray-400">Seleccione un género para ver los campos y gráficos.</p>
                )}
                {fields.map((field) => {
                     // Preparar datos para el gráfico de este campo
                    const chartData: ChartData<'bar'> = {
                        labels: ['Edad Abs.'], // Etiqueta simple para el eje Y (oculto)
                        datasets: [
                            {
                                label: field.translate, // Usado en el tooltip
                                data: [field.absolute_value ?? 0], // Usar 0 si es null para mostrar la barra
                                backgroundColor: field.absolute_value !== null ? 'rgb(35, 188, 239)' : 'rgb(200, 200, 200)', // Color primario o gris si no hay valor
                                borderColor: field.absolute_value !== null ? 'rgb(41, 59, 100)' : 'rgb(150, 150, 150)',
                                borderWidth: 1,
                                barThickness: 20, // Grosor fijo de barra
                            },
                        ],
                    };

                    return (
                        <div key={field.name} className="chart-item flex items-center border border-gray-200 dark:border-gray-600 p-2 rounded bg-gray-50 dark:bg-gray-600">
                            <span className="chart-label text-xs font-medium text-gray-600 dark:text-gray-300 mr-3 w-28 text-right shrink-0">
                                {field.translate.replace(/ \(.+?\)/g, '')}: {/* Quitar unidades para etiquetas cortas */}
                            </span>
                            <div className="chart-canvas-container flex-grow h-10"> {/* Contenedor con altura fija */}
                                {gender && <Bar options={commonChartOptions} data={chartData} />} {/* Solo renderizar gráfico si hay género */}
                            </div>
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

export default EdadBiofisicaTab;