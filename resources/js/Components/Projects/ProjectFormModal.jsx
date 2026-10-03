import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { createProject, updateProject, validationErrors } from '@/api/projects';
import { useEffect, useState } from 'react';
import SelectInput from './SelectInput';

const textareaClass =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

const emptyForm = {
    client_name: '',
    project_name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    start_date: '',
    due_date: '',
};

function toForm(project) {
    if (!project) return emptyForm;

    return {
        client_name: project.client_name,
        project_name: project.project_name,
        description: project.description ?? '',
        status: project.status,
        priority: project.priority,
        start_date: project.start_date ?? '',
        due_date: project.due_date ?? '',
    };
}

export default function ProjectFormModal({ show, project, statuses, priorities, onClose, onSaved }) {
    const isEditing = Boolean(project);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Reset the form each time the modal opens.
    useEffect(() => {
        if (show) {
            setForm(toForm(project));
            setErrors({});
            setGeneralError(null);
        }
    }, [show, project]);

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setGeneralError(null);

        try {
            const saved = isEditing
                ? await updateProject(project.id, form)
                : await createProject(form);
            onSaved(saved, isEditing);
        } catch (error) {
            const fieldErrors = validationErrors(error);

            if (fieldErrors) {
                setErrors(fieldErrors);
            } else {
                setGeneralError('Something went wrong while saving. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing ? 'Edit project' : 'New project'}
                </h2>

                {generalError && (
                    <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {generalError}
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="client_name" value="Client name *" />
                        <TextInput
                            id="client_name"
                            value={form.client_name}
                            onChange={set('client_name')}
                            className="mt-1 block w-full"
                            isFocused={show}
                        />
                        <InputError message={errors.client_name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="project_name" value="Project name *" />
                        <TextInput
                            id="project_name"
                            value={form.project_name}
                            onChange={set('project_name')}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.project_name} className="mt-1" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            rows={3}
                            value={form.description}
                            onChange={set('description')}
                            className={textareaClass}
                        />
                        <InputError message={errors.description} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <SelectInput id="status" value={form.status} onChange={set('status')} className="mt-1 block w-full">
                            {statuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="priority" value="Priority" />
                        <SelectInput id="priority" value={form.priority} onChange={set('priority')} className="mt-1 block w-full">
                            {priorities.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.priority} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="start_date" value="Start date" />
                        <TextInput
                            id="start_date"
                            type="date"
                            value={form.start_date}
                            onChange={set('start_date')}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.start_date} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="due_date" value="Due date" />
                        <TextInput
                            id="due_date"
                            type="date"
                            value={form.due_date}
                            onChange={set('due_date')}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.due_date} className="mt-1" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={saving}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={saving}>
                        {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
