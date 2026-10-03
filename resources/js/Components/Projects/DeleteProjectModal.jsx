import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { deleteProject } from '@/api/projects';
import { useEffect, useState } from 'react';

export default function DeleteProjectModal({ show, project, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) setError(null);
    }, [show]);

    async function confirm() {
        setDeleting(true);
        setError(null);

        try {
            await deleteProject(project.id);
            onDeleted(project);
        } catch {
            setError('Could not delete the project. Please try again.');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Delete project?</h2>
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{project?.project_name}</span>{' '}
                    for {project?.client_name} will be permanently deleted.
                </p>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={deleting}>
                        Cancel
                    </SecondaryButton>
                    <DangerButton onClick={confirm} disabled={deleting}>
                        {deleting ? 'Deleting…' : 'Delete'}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
