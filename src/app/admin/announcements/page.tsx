'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Megaphone, 
  Trash2, 
  Plus, 
  Calendar,
  Info,
  Gift,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'promo' | 'maintenance' | 'content';
  createdAt: any;
}

const announcementTypes = [
  { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-500', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'promo', label: 'Promo', icon: Gift, color: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'maintenance', label: 'Maintenance', icon: AlertTriangle, color: 'bg-red-500', badgeColor: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'content', label: 'Content', icon: FileText, color: 'bg-green-500', badgeColor: 'bg-green-100 text-green-800 border-green-200' },
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as Announcement['type']
  });

  // Load announcements
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Announcement[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          type: data.type,
          createdAt: data.createdAt
        });
      });
      setAnnouncements(items);
      setLoading(false);
    }, (error) => {
      console.error('Error loading announcements:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit new announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'announcements'), {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        createdAt: serverTimestamp()
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'info'
      });

      setIsDialogOpen(false);
      
      toast({
        title: "Success!",
        description: "Announcement posted successfully"
      });

    } catch (error) {
      console.error('Error posting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to post announcement",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete announcement
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'announcements', id));
      
      toast({
        title: "Deleted",
        description: "Announcement deleted successfully"
      });

    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  // Get type config
  const getTypeConfig = (type: string) => {
    return announcementTypes.find(t => t.value === type) || announcementTypes[0];
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-zinc-400">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-rose-500" />
              Manage Announcements
            </h1>
            <p className="text-zinc-400">
              Create and manage system announcements for users
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  Create New Announcement
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Post a new announcement for all users to see
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-zinc-300">
                    Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter announcement title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                    disabled={submitting}
                  />
                </div>

                {/* Type Select */}
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium text-zinc-300">
                    Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    disabled={submitting}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {announcementTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-zinc-300">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Enter announcement content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 resize-none"
                    disabled={submitting}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Megaphone className="w-4 h-4 mr-2" />
                        Post Announcement
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Recent Announcements
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No announcements yet</h3>
                <p className="text-zinc-400 mb-6">
                  Create your first announcement to keep users informed
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Announcement
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => {
                  const typeConfig = getTypeConfig(announcement.type);
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <div
                      key={announcement.id}
                      className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left side - Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant="outline" 
                              className={`${typeConfig.badgeColor} border`}
                            >
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {typeConfig.label}
                            </Badge>
                            <div className="flex items-center gap-1 text-zinc-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(announcement.createdAt)}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {announcement.title}
                          </h3>
                          
                          <p className="text-zinc-300 leading-relaxed">
                            {truncateContent(announcement.content)}
                          </p>
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(announcement.id, announcement.title)}
                            className="border-zinc-600 text-zinc-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}