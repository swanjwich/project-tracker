import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export default function ProjectActions({ project, onEdit, onDelete }) {
    return (
        // Stop clicks here from also triggering the row's "click to edit".
        <Menu as="div" className="inline-block text-left" onClick={(e) => e.stopPropagation()}>
            <MenuButton
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Actions for ${project.project_name}`}
            >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                </svg>
            </MenuButton>

            <MenuItems
                anchor="bottom end"
                className="z-50 mt-1 w-36 rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
                <MenuItem>
                    <button
                        type="button"
                        onClick={() => onEdit(project)}
                        className="block w-full px-4 py-2 text-left text-gray-700 data-[focus]:bg-gray-100"
                    >
                        Edit
                    </button>
                </MenuItem>
                <MenuItem>
                    <button
                        type="button"
                        onClick={() => onDelete(project)}
                        className="block w-full px-4 py-2 text-left text-red-600 data-[focus]:bg-red-50"
                    >
                        Delete
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
