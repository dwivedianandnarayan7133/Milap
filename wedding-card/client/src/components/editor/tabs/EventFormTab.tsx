import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import { EVENT_CATEGORIES } from '../../../data/categories';
import { SUPPORTED_LANGUAGES } from '../../../data/languages';
import { Sparkles, Calendar, MapPin, Users, Heart } from 'lucide-react';

export const EventFormTab: React.FC = () => {
  const { project, updateEventDetails, setCategory, setLanguage } = useCardStore();
  const details = project.eventDetails;

  const currentCategoryMeta =
    EVENT_CATEGORIES.find((c) => c.id === project.category) || EVENT_CATEGORIES[0];
  const fields = currentCategoryMeta.fields;

  const handleChange = (field: string, value: any) => {
    updateEventDetails({ [field]: value });
  };

  return (
    <div className="p-4 space-y-6 text-stone-800 text-sm overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Category & Language Header */}
      <div className="bg-amber-50/80 p-3.5 rounded-lg border border-amber-200/80 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-royal-maroon uppercase tracking-wider mb-1">
            Event Category
          </label>
          <select
            value={project.category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.hindiName})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Script</label>
            <select
              value={project.language}
              onChange={(e) => setLanguage(e.target.value as any, project.secondaryLanguage, project.eventDetails.isBilingual)}
              className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs focus:border-royal-gold outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Bilingual Card</label>
            <div className="flex items-center h-[34px]">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(details.isBilingual)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLanguage(project.language, checked ? 'en' : undefined, checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-royal-gold"></div>
                <span className="ml-2 text-xs text-stone-600 font-medium">Bilingual</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Couple Information (Weddings / Engagements) */}
      {fields.hasCouple && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-royal-maroon font-semibold border-b border-stone-200 pb-1">
            <Heart className="w-4 h-4 text-royal-gold" />
            <span>Couple Information</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Groom's Name (वर)</label>
              <input
                type="text"
                value={details.groomName || ''}
                onChange={(e) => handleChange('groomName', e.target.value)}
                placeholder="e.g. आदित्य / Aarav"
                className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Bride's Name (वधू)</label>
              <input
                type="text"
                value={details.brideName || ''}
                onChange={(e) => handleChange('brideName', e.target.value)}
                placeholder="e.g. अनन्या / Meera"
                className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
              />
            </div>
          </div>

          {fields.hasParents && (
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Groom's Parents</label>
                <input
                  type="text"
                  value={details.groomParents || ''}
                  onChange={(e) => handleChange('groomParents', e.target.value)}
                  placeholder="e.g. श्रीमती संगीता एवं श्री राजेश शर्मा"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Bride's Parents</label>
                <input
                  type="text"
                  value={details.brideParents || ''}
                  onChange={(e) => handleChange('brideParents', e.target.value)}
                  placeholder="e.g. श्रीमती कविता एवं श्री दिनेश वर्मा"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Celebrant Info (Birthdays / Anniversaries / Baby Showers / Retirement) */}
      {fields.hasCelebrant && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-royal-maroon font-semibold border-b border-stone-200 pb-1">
            <Sparkles className="w-4 h-4 text-royal-gold" />
            <span>Celebrant Information</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={fields.hasAge ? 'col-span-2' : 'col-span-3'}>
              <label className="block text-xs font-medium text-stone-600 mb-1">Celebrant Name</label>
              <input
                type="text"
                value={details.celebrantName || ''}
                onChange={(e) => handleChange('celebrantName', e.target.value)}
                placeholder="e.g. Aarohi / श्वेता"
                className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
              />
            </div>
            {fields.hasAge && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Age / Years</label>
                <input
                  type="text"
                  value={details.celebrantAge || ''}
                  onChange={(e) => handleChange('celebrantAge', e.target.value)}
                  placeholder="e.g. 1st / 25th"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date, Time & Auspicious Muhurat */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-royal-maroon font-semibold border-b border-stone-200 pb-1">
          <Calendar className="w-4 h-4 text-royal-gold" />
          <span>Date & Muhurat</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Event Date (तिथि)</label>
            <input
              type="text"
              value={details.weddingDate || ''}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              placeholder="e.g. 28 नवम्बर 2025"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Time (समय)</label>
            <input
              type="text"
              value={details.weddingTime || ''}
              onChange={(e) => handleChange('weddingTime', e.target.value)}
              placeholder="e.g. सायं 07:00 बजे"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Auspicious Muhurat (शुभ लग्न मुहूर्त)</label>
          <input
            type="text"
            value={details.muhuratTime || ''}
            onChange={(e) => handleChange('muhuratTime', e.target.value)}
            placeholder="e.g. रात्रि 08:15 बजे, अमृत बेला"
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
          />
        </div>
      </div>

      {/* Venue & Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-royal-maroon font-semibold border-b border-stone-200 pb-1">
          <MapPin className="w-4 h-4 text-royal-gold" />
          <span>Venue & Address</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Venue Name (स्थान)</label>
          <input
            type="text"
            value={details.venueName || ''}
            onChange={(e) => handleChange('venueName', e.target.value)}
            placeholder="e.g. The Leela Palace / होटल क्लार्क्स आमेर"
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-royal-gold outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-1">Full Address</label>
            <input
              type="text"
              value={details.venueAddress || ''}
              onChange={(e) => handleChange('venueAddress', e.target.value)}
              placeholder="e.g. पिछोला झील के किनारे"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
            <input
              type="text"
              value={details.venueCity || ''}
              onChange={(e) => handleChange('venueCity', e.target.value)}
              placeholder="e.g. उदयपुर"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Google Maps / Directions Link</label>
          <input
            type="url"
            value={details.googleMapsUrl || ''}
            onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
          />
        </div>
      </div>

      {/* RSVP & Hosts */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-royal-maroon font-semibold border-b border-stone-200 pb-1">
          <Users className="w-4 h-4 text-royal-gold" />
          <span>Hosts & RSVP</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Hosts / Family (निमंत्रक)</label>
          <input
            type="text"
            value={details.hosts || ''}
            onChange={(e) => handleChange('hosts', e.target.value)}
            placeholder="e.g. समस्त शर्मा एवं वर्मा परिवार"
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">RSVP Contact Person</label>
            <input
              type="text"
              value={details.rsvpName || ''}
              onChange={(e) => handleChange('rsvpName', e.target.value)}
              placeholder="e.g. राजेश शर्मा"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">RSVP Phone Number</label>
            <input
              type="tel"
              value={details.rsvpPhone || ''}
              onChange={(e) => handleChange('rsvpPhone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
