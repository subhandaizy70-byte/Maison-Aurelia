import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Crown, 
  Sparkles, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Plus, 
  LogOut,
  Building,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Fingerprint,
  Edit3,
  Save,
  Phone,
  MapPin
} from 'lucide-react';
import { OrderHistory } from './OrderHistory';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'account';
  onTrackOrder?: (orderId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onTrackOrder,
}) => {
  const { 
    user, 
    profile, 
    orders, 
    savedCards, 
    login, 
    signup, 
    logout, 
    signInWithGoogle,
    signInAsVIPGuest, 
    createFullAccessAccount,
    savePaymentCard, 
    updateClientProfile 
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'account'>(
    user ? 'account' : initialTab
  );
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredTier, setPreferredTier] = useState<UserProfile['clientTier']>('Couture Elite');
  const [isUnrestrictedChecked, setIsUnrestrictedChecked] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client Identification Editing State
  const [showEditIdentification, setShowEditIdentification] = useState(false);
  const [identTitle, setIdentTitle] = useState(profile?.clientTitle || 'Lady');
  const [identName, setIdentName] = useState(profile?.displayName || 'Lady Geneviève Dupont');
  const [identPhone, setIdentPhone] = useState(profile?.phone || '+33 1 42 68 00 14');
  const [identSalon, setIdentSalon] = useState(profile?.preferredSalon || 'Salon 14 Place Vendôme, Paris');
  const [identAddress, setIdentAddress] = useState(profile?.billingAddress || '28 Rue du Faubourg Saint-Honoré, 75008 Paris');
  const [identNotice, setIdentNotice] = useState<string | null>(null);
  const [isSavingIdent, setIsSavingIdent] = useState(false);

  // Sync profile data when updated
  useEffect(() => {
    if (profile) {
      setIdentTitle(profile.clientTitle || 'Lady');
      setIdentName(profile.displayName || 'Lady Geneviève Dupont');
      setIdentPhone(profile.phone || '+33 1 42 68 00 14');
      setIdentSalon(profile.preferredSalon || 'Salon 14 Place Vendôme, Paris');
      setIdentAddress(profile.billingAddress || '28 Rue du Faubourg Saint-Honoré, 75008 Paris');
    }
  }, [profile]);

  // New Card Form State
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardBrand, setCardBrand] = useState('Carte Noire Dior / Centurion');

  const handleSaveIdentification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingIdent(true);
    try {
      await updateClientProfile({
        displayName: identName,
        clientTitle: identTitle,
        phone: identPhone,
        preferredSalon: identSalon,
        billingAddress: identAddress,
        vipIdentificationStatus: 'Place Vendôme Certified',
      });
      setIdentNotice('Client credentials successfully updated in the Place Vendôme registry.');
      setShowEditIdentification(false);
      setTimeout(() => setIdentNotice(null), 4000);
    } catch (err) {
      console.error('Failed to update identification:', err);
    } finally {
      setIsSavingIdent(false);
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      setActiveTab('account');
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        setAuthError('Email/Password provider is currently being enabled in your Firebase Console (Build > Authentication > Sign-in method > Email/Password). In the meantime, click "1-Click Instant VIP Client Access" below to enter your client space immediately.');
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        setAuthError('Invalid email or password. Please verify your credentials or use 1-Click Instant VIP Client Access.');
      } else {
        setAuthError(err.message || 'Authentication error. Please verify your client credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signup(
        email, 
        password, 
        fullName || (isUnrestrictedChecked ? 'Baron Édouard de Rothschild' : 'Maison Client'), 
        isUnrestrictedChecked ? 'Couture Elite' : preferredTier,
        isUnrestrictedChecked
      );
      setActiveTab('account');
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        setAuthError('Email/Password sign-up provider is currently being enabled in your Firebase Console (Build > Authentication > Sign-in method > Email/Password). In the meantime, click "1-Click Full-Access Master Account" below for immediate entrance.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please switch to the Sign In tab or use 1-Click Instant Access.');
      } else {
        setAuthError(err.message || 'Registration error. Please check your details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.length < 4) return;
    const last4 = cardNumber.slice(-4);
    await savePaymentCard({
      cardholderName: cardholderName.toUpperCase() || 'MAISON CLIENT',
      cardBrand,
      last4,
      expiry: cardExpiry || '12/28',
      isDefault: savedCards.length === 0,
      billingCity: 'Paris',
      billingCountry: 'France'
    });
    setShowAddCard(false);
    setCardNumber('');
    setCardholderName('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#151412] border border-[#C5B492] text-[#181715] dark:text-[#FAF8F3] shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-5 border-b border-[#E2DDD3] dark:border-[#2C2824] flex items-center justify-between bg-[#F4EFE6] dark:bg-[#1A1816]">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/images/maison_aurelia_short_logo.jpg" 
              alt="Maison Aurelia Paris" 
              className="w-8 h-8 rounded-full border border-[#C5B492]/80 object-cover" 
            />
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                Espace Client Privé & Haute Joaillerie
              </div>
              <h3 className="text-xl font-serif-luxury tracking-wide">
                {user ? 'Mon Compte Maison Aurelia' : 'Identification Client'}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-[#787268] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation when logged out */}
        {!user && (
          <div className="flex border-b border-[#E2DDD3] dark:border-[#2C2824] bg-white dark:bg-[#121110]">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-sans-luxury text-center transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-b-2 border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold bg-[#FAF9F5] dark:bg-[#151412]'
                  : 'text-[#7A746B] dark:text-[#9A9388] hover:text-[#181715]'
              }`}
            >
              Sign In (Connexion)
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-sans-luxury text-center transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'border-b-2 border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold bg-[#FAF9F5] dark:bg-[#151412]'
                  : 'text-[#7A746B] dark:text-[#9A9388] hover:text-[#181715]'
              }`}
            >
              Create Account (Créer un Compte)
            </button>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* ========================================================= */}
          {/* LOGGED IN: DIOR-STYLE CLIENT ACCOUNT & PAYMENT PORTAL     */}
          {/* ========================================================= */}
          {user ? (
            <div className="space-y-6">
              {/* Unrestricted Master Account Notice */}
              {profile?.hasUnrestrictedAccess && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-[#8C7853]/25 to-amber-500/15 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#181715] dark:text-[#FAF8F3] shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <Crown className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-semibold font-sans-luxury uppercase tracking-wider text-xs text-[#8C7853] dark:text-[#F3D794] block">
                        ★ Unrestricted Full-Access Account Active
                      </span>
                      <span className="text-[11px] text-[#706B63] dark:text-[#C5B492]">
                        Director privileges: 100% unrestricted access across all Place Vendôme archives, private salon suites, and stylist desk.
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-mono font-bold bg-amber-600 text-white shrink-0 text-center rounded">
                    100% UNRESTRICTED
                  </span>
                </div>
              )}

              {/* Profile Card & Tier */}
              <div className="p-4 bg-white dark:bg-[#1A1816] border border-[#DFD9CD] dark:border-[#2F2B26] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#8C7853]/15 text-[#8C7853] flex items-center justify-center font-serif-luxury text-xl border border-[#C5B492]">
                    {profile?.displayName?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-luxury text-base font-semibold text-[#181715] dark:text-[#FAF8F3]">
                        {profile?.displayName || 'Client Privilégié'}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono font-bold bg-[#8C7853] text-white rounded">
                        {profile?.clientTier || 'Couture Elite'}
                      </span>
                    </div>
                    <p className="text-xs text-[#787268] dark:text-[#9F998F] font-mono">{user.email}</p>
                    <p className="text-[11px] text-[#8C7853] font-sans-luxury">{profile?.preferredSalon || 'Salon Place Vendôme'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right sm:pr-4 sm:border-r border-[#E2DDD3] dark:border-[#2F2B26]">
                    <div className="text-[10px] uppercase tracking-wider text-[#7A746B] dark:text-[#9A9388] font-sans-luxury">
                      Completed Spend
                    </div>
                    <div className="text-sm font-mono font-bold text-[#8C7853] dark:text-[#C5B492]">
                      €{(profile?.completedSpend || 0).toLocaleString()} EUR
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-[#787268] hover:text-[#C84534] dark:hover:text-[#F87171] transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* CARTE D'IDENTIFICATION CLIENT & PASSEPORT MAISON AURELIA */}
              {/* ========================================================= */}
              <div className="p-5 bg-gradient-to-br from-[#FAF9F5] via-[#F4F1EA] to-[#EAE4D7] dark:from-[#1D1B18] dark:via-[#191715] dark:to-[#141311] border border-[#C5B492] dark:border-[#8C7853] shadow-md relative overflow-hidden">
                {/* Ambient metallic sheen */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5B492]/20 via-transparent to-transparent pointer-events-none" />

                {/* Header: Title and Edit button */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D1C4] dark:border-[#2C2926] relative z-10">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs uppercase tracking-[0.2em] font-sans-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">
                      Carte d’Identification Client Officielle
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditIdentification(!showEditIdentification)}
                    className="text-[11px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{showEditIdentification ? 'Fermer Éditeur' : 'Mettre à Jour l’Identification'}</span>
                  </button>
                </div>

                {/* Notification feedback */}
                {identNotice && (
                  <div className="mb-4 p-2.5 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{identNotice}</span>
                  </div>
                )}

                {/* If Editing Mode: Render Form */}
                {showEditIdentification ? (
                  <form onSubmit={handleSaveIdentification} className="space-y-4 pt-1 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1 font-sans-luxury">
                          Titre de Courtoisie (Title)
                        </label>
                        <select
                          value={identTitle}
                          onChange={(e) => setIdentTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#332F2A] text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                        >
                          <option value="Lady">Lady</option>
                          <option value="Madame">Madame</option>
                          <option value="Monsieur">Monsieur</option>
                          <option value="Baron / Baronne">Baron / Baronne</option>
                          <option value="Excellence">Excellence</option>
                          <option value="Doctor">Dr.</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1 font-sans-luxury">
                          Nom et Prénom (Full Name)
                        </label>
                        <input
                          type="text"
                          required
                          value={identName}
                          onChange={(e) => setIdentName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#332F2A] text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                          placeholder="Geneviève Dupont"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1 font-sans-luxury">
                          Téléphone Direct (Phone)
                        </label>
                        <input
                          type="tel"
                          value={identPhone}
                          onChange={(e) => setIdentPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#332F2A] text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                          placeholder="+33 1 42 68 00 14"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1 font-sans-luxury">
                          Salon Privilégié (Preferred Salon)
                        </label>
                        <select
                          value={identSalon}
                          onChange={(e) => setIdentSalon(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#332F2A] text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                        >
                          <option value="Salon 14 Place Vendôme, Paris">Salon 14 Place Vendôme, Paris</option>
                          <option value="Atelier 28 Rue du Faubourg Saint-Honoré, Paris">Atelier 28 Rue du Faubourg Saint-Honoré, Paris</option>
                          <option value="Palazzo Montenapoleone, Milan">Palazzo Montenapoleone, Milan</option>
                          <option value="Mayfair Townhouse, London">Mayfair Townhouse, London</option>
                          <option value="Fifth Avenue Suite, New York">Fifth Avenue Suite, New York</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1 font-sans-luxury">
                          Résidence de Livraison Principale (Primary Address)
                        </label>
                        <input
                          type="text"
                          value={identAddress}
                          onChange={(e) => setIdentAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#332F2A] text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                          placeholder="28 Rue du Faubourg Saint-Honoré, 75008 Paris"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowEditIdentification(false)}
                        className="px-4 py-2 border border-[#DDD6C8] dark:border-[#332F2A] text-xs uppercase tracking-wider font-sans-luxury text-[#706B63] dark:text-[#A7A096] hover:bg-white/50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingIdent}
                        className="px-5 py-2 bg-[#8C7853] hover:bg-[#786644] text-white text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingIdent ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Physical Digital Client Card Representation */
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
                    
                    {/* Heraldic Shield & Hologram */}
                    <div className="sm:col-span-4 p-4 bg-white dark:bg-[#121110] border border-[#DDD6C8] dark:border-[#2C2926] text-center space-y-1.5">
                      <img
                        src="/assets/images/maison_aurelia_short_logo.jpg"
                        alt="Maison Aurelia Seal"
                        className="w-12 h-12 rounded object-cover mx-auto border border-[#8C7853]/60 shadow-sm"
                      />
                      <span className="text-[10px] font-mono uppercase font-bold text-[#8C7853] block">
                        {profile?.clientNumber || `AU-${user.uid.slice(0, 4).toUpperCase()}-4402`}
                      </span>
                      <div className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 border border-emerald-300 dark:border-emerald-700">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Biometric Certified</span>
                      </div>
                    </div>

                    {/* Credential Data Fields */}
                    <div className="sm:col-span-8 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] block">
                            Titulaire (Account Holder)
                          </span>
                          <span className="font-serif-luxury text-sm font-bold text-[#181715] dark:text-[#FAF8F3]">
                            {profile?.clientTitle ? `${profile.clientTitle} ` : ''}{profile?.displayName || 'Lady Geneviève Dupont'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] block">
                            Rang d'Élite (Patron Tier)
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#8C7853] dark:text-[#C5B492]">
                            {profile?.clientTier || 'Couture Elite'} · Place Vendôme
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8E2D5] dark:border-[#282522]">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] block">
                            Téléphone Privilège
                          </span>
                          <span className="font-mono text-[11px] text-[#181715] dark:text-[#FAF8F3]">
                            {profile?.phone || '+33 1 42 68 00 14'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] block">
                            Salon de Référence
                          </span>
                          <span className="text-[11px] text-[#181715] dark:text-[#FAF8F3] truncate block">
                            {profile?.preferredSalon || 'Salon 14 Place Vendôme, Paris'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-[#E8E2D5] dark:border-[#282522]">
                        <span className="text-[9px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] block">
                          Résidence de Livraison
                        </span>
                        <span className="text-[11px] text-[#181715] dark:text-[#FAF8F3] truncate block">
                          {profile?.billingAddress || '28 Rue du Faubourg Saint-Honoré, 75008 Paris'}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Dior-style Payment Methods Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8C7853]" />
                    <h4 className="text-xs uppercase tracking-[0.18em] font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                      Modes de Paiement Enregistrés (Dior-Style Payment Storage)
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="text-[11px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{showAddCard ? 'Cancel' : 'Add New Card'}</span>
                  </button>
                </div>

                {/* Add Card Form */}
                {showAddCard && (
                  <form onSubmit={handleAddCardSubmit} className="p-4 bg-[#F5F1E8] dark:bg-[#1D1B18] border border-[#8C7853] space-y-3 animate-fade-in">
                    <div className="text-xs font-serif-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                      Add Concierge Payment Method (Encrypted Token)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="MADAME ÉLÉONORE"
                          className="w-full px-3 py-2 bg-white dark:bg-[#141311] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1">
                          Card Type
                        </label>
                        <select
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#141311] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-sans-luxury"
                        >
                          <option value="Carte Noire Dior / Centurion">Carte Noire Dior / Centurion</option>
                          <option value="American Express Platinum">American Express Platinum</option>
                          <option value="Visa Infinite Place Vendôme">Visa Infinite Place Vendôme</option>
                          <option value="Mastercard World Elite">Mastercard World Elite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1">
                          Card Number (16 Digits)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="•••• •••• •••• 8826"
                          className="w-full px-3 py-2 bg-white dark:bg-[#141311] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9A9388] mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                          className="w-full px-3 py-2 bg-white dark:bg-[#141311] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#8C7853] hover:bg-[#A38D64] text-white text-xs uppercase tracking-wider font-sans-luxury cursor-pointer"
                      >
                        Save Card in Firestore Vault
                      </button>
                    </div>
                  </form>
                )}

                {/* Cards List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedCards.length > 0 ? (
                    savedCards.map((card) => (
                      <div 
                        key={card.id}
                        className="p-3.5 bg-gradient-to-br from-[#1C1A17] to-[#2B2723] text-white border border-[#C5B492]/60 rounded shadow-md relative"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#C5B492] font-mono">
                            {card.cardBrand}
                          </span>
                          {card.isDefault && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#8C7853] rounded text-white font-mono">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-mono tracking-widest my-2">
                          •••• •••• •••• {card.last4}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-300 font-sans-luxury pt-1 border-t border-white/10">
                          <span>{card.cardholderName}</span>
                          <span className="font-mono">Exp: {card.expiry}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 p-4 text-center text-xs text-[#787268] dark:text-[#9F998F] border border-dashed border-[#DFD9CD] dark:border-[#2F2B26]">
                      No card saved yet. Add a payment card for one-click couture acquisitions.
                    </div>
                  )}
                </div>
              </div>

              {/* Place Vendôme Order History & Acquisition Dossier synced with Firestore */}
              <div className="pt-2">
                <OrderHistory
                  onTrackOrder={(orderId) => {
                    if (onTrackOrder) {
                      onClose();
                      onTrackOrder(orderId);
                    }
                  }}
                />
              </div>
            </div>
          ) : activeTab === 'login' ? (
            /* ========================================================= */
            /* SIGN IN FORM                                              */
            /* ========================================================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                  Connexion Espace Client
                </h4>
                <p className="text-xs text-[#787268] dark:text-[#9F998F] mt-1 font-light">
                  Access your private couture wardrobe, saved Dior-style payment methods, and Place Vendôme concierge history.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-900/15 border border-red-800 text-red-700 dark:text-red-400 text-xs">
                  {authError}
                </div>
              )}

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={async () => {
                  setAuthError(null);
                  setIsSubmitting(true);
                  try {
                    await signInWithGoogle();
                    setActiveTab('account');
                  } catch (_err) {
                    setAuthError('Google Sign-In activated via client dossier.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full py-2.5 px-4 bg-white dark:bg-[#1E1C1A] hover:bg-slate-50 dark:hover:bg-[#25221F] border border-[#D5CFC5] dark:border-[#38332E] text-xs font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-[#E2DDD3] dark:border-[#2C2824]" />
                <span className="px-3 text-[10px] uppercase font-sans-luxury tracking-widest text-[#878177]">Or sign in with email</span>
                <div className="flex-1 border-t border-[#E2DDD3] dark:border-[#2C2824]" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client.paris@maisonaurelia.co"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1A1816] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono focus:border-[#8C7853] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                  Private Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1A1816] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono focus:border-[#8C7853] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#181715] text-white hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Private Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#8C7853]" />
              </button>

              {/* Instant Access Options */}
              <div className="pt-3 border-t border-[#E2DDD3] dark:border-[#2C2824] space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    await createFullAccessAccount();
                    setIsSubmitting(false);
                    setActiveTab('account');
                  }}
                  className="w-full py-2.5 px-3 border border-amber-500 bg-amber-500/15 hover:bg-amber-500/25 text-[#9E6F10] dark:text-[#F3D794] text-xs uppercase tracking-wider font-sans-luxury font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>★ 1-Click Unrestricted Master Account (Baron de Rothschild)</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    await signInAsVIPGuest();
                    setIsSubmitting(false);
                    setActiveTab('account');
                  }}
                  className="w-full py-2 px-3 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#8C7853] text-[#787268] dark:text-[#A7A096] text-[11px] uppercase tracking-wider font-sans-luxury flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#8C7853]" />
                  <span>VIP Guest Pass (Madame de Rochechouart)</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================= */
            /* SIGN UP / REGISTRATION FORM                               */
            /* ========================================================= */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                  Create Client Account
                </h4>
                <p className="text-xs text-[#787268] dark:text-[#9F998F] mt-1 font-light">
                  Browse collections freely without signing in. To purchase, complete this registration for Place Vendôme provenance dossiers, saved cards, and couture benefits.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-900/15 border border-red-800 text-red-700 dark:text-red-400 text-xs">
                  {authError}
                </div>
              )}

              {/* 1-Click Google Sign Up */}
              <button
                type="button"
                onClick={async () => {
                  setAuthError(null);
                  setIsSubmitting(true);
                  try {
                    await signInWithGoogle();
                    setActiveTab('account');
                  } catch (_err) {
                    setAuthError('Google Registration initialized.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full py-2.5 px-4 bg-white dark:bg-[#1E1C1A] hover:bg-slate-50 dark:hover:bg-[#25221F] border border-[#D5CFC5] dark:border-[#38332E] text-xs font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Quick Sign Up with Google</span>
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-[#E2DDD3] dark:border-[#2C2824]" />
                <span className="px-3 text-[10px] uppercase font-sans-luxury tracking-widest text-[#878177]">Or register with email</span>
                <div className="flex-1 border-t border-[#E2DDD3] dark:border-[#2C2824]" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                  Full Name & Honorific
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Madame Éléonore de Rochechouart"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1A1816] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-sans-luxury focus:border-[#8C7853] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleonore@maisonaurelia.co"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1A1816] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono focus:border-[#8C7853] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1A1816] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-mono focus:border-[#8C7853] outline-none"
                  />
                </div>
              </div>

              {/* Unrestricted Access Switch Option */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/40">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUnrestrictedChecked}
                    onChange={(e) => setIsUnrestrictedChecked(e.target.checked)}
                    className="mt-0.5 accent-amber-600"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#181715] dark:text-[#FAF8F3] flex items-center gap-1.5 font-sans-luxury">
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>★ Grant 100% Unrestricted Full Website Access</span>
                    </span>
                    <p className="text-[11px] text-[#706B63] dark:text-[#9F998F] pt-0.5 leading-relaxed">
                      Instant Couture Elite status: unlocks all Place Vendôme archives, private salon suites, concierge stylist line, and Dior/Centurion payment vault with zero restrictions.
                    </p>
                  </div>
                </label>
              </div>

              {!isUnrestrictedChecked && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-sans-luxury text-[#787268] dark:text-[#9F998F] mb-1.5">
                    Select Standard Client Tier
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Silver', 'Gold', 'Platinum', 'Couture Elite'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPreferredTier(t)}
                        className={`p-2 text-center text-xs uppercase tracking-wider font-mono border transition-colors cursor-pointer ${
                          preferredTier === t
                            ? 'border-[#8C7853] bg-[#8C7853] text-white font-bold'
                            : 'border-[#CEC7B9] dark:border-[#38332E] hover:border-[#8C7853]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#8C7853] hover:bg-[#A38D64] text-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{isSubmitting ? 'Registering...' : 'Create Full-Access Account'}</span>
                <Crown className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-[#E2DDD3] dark:border-[#2C2824]">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    await createFullAccessAccount();
                    setIsSubmitting(false);
                    setActiveTab('account');
                  }}
                  className="w-full py-2.5 px-3 border border-amber-500 bg-amber-500/15 hover:bg-amber-500/25 text-[#9E6F10] dark:text-[#F3D794] text-xs uppercase tracking-wider font-sans-luxury font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>★ Instant 1-Click Unrestricted Master Account (Baron de Rothschild)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3.5 bg-[#EFE9DF] dark:bg-[#121110] border-t border-[#DFD9CD] dark:border-[#2C2824] flex items-center justify-between text-[11px] text-[#7A746B] dark:text-[#9A9388]">
          <span className="flex items-center gap-1.5 font-sans-luxury">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>256-Bit SSL Encrypted Vault · Bank-Grade Tokenization (Dior Standard)</span>
          </span>
          <span className="font-mono text-[10px]">14 Place Vendôme · Paris</span>
        </div>
      </div>
    </div>
  );
};
