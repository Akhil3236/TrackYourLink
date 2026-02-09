import { useState } from 'react';
import { linkService } from '../services/linkService';
import { Plus, Link as LinkIcon, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateLinkForm = ({ onLinkCreated }) => {
    const [formData, setFormData] = useState({ url: '', slug: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await linkService.createLink(formData);
            toast.success('Link generated successfully');
            setFormData({ url: '', slug: '' });
            if (onLinkCreated) {
                onLinkCreated(response);
            }
        } catch (err) {
            const errorMsg = err.message || 'Failed to create link. Slug might be taken.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-link-card">
            <h2>
                <Plus size={24} className="text-primary" />
                Create New Link
            </h2>
            <form onSubmit={handleSubmit} className="create-link-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <LinkIcon size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Original URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/long-url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <Tag size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Custom Slug
                        </label>
                        <input
                            type="text"
                            placeholder="my-link"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                    </div>
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading} className="btn-primary">
                    <Plus size={18} />
                    {loading ? 'Generating...' : 'Create Short Link'}
                </button>
            </form>
        </div>
    );
};
