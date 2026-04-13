import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { User, Mail, Building2, Globe, Calendar, Briefcase } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl font-bold">
          {user.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-display text-gold-gradient">{user.name}</h1>
          <p className="text-muted-foreground">{user.role} Account</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-8 border-gold-glow">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-gold-400" /> Profil Informations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adresse Email</p>
                <p className="font-medium text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rôle sur la plateforme</p>
                <p className="font-medium text-sm capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membre depuis</p>
                <p className="font-medium text-sm">{new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entreprise</p>
                <p className="font-medium text-sm">{user.company || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pays</p>
                <p className="font-medium text-sm">{user.country || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Biographie complète</h3>
          <p className="text-sm leading-relaxed text-foreground/80 bg-white/5 p-4 rounded-xl">
            {user.bio || "Aucune biographie n'a été renseignée pour le moment."}
          </p>
        </div>
      </div>
    </div>
  );
}
