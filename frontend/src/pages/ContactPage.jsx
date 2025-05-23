import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, CheckCircle, X, Users, Settings } from "lucide-react";

const ContactPage = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateContactForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    if (!formData.message.trim()) errors.message = "Le message est requis";
    return errors;
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateContactForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const serviceID = "service_2pzo1cc";
    const templateID = "template_rp2oiha";
    const publicKey = "4kE1tO95wZi27yOWk";

    const emailParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject || "Sans sujet",
      message: formData.message
    };

    try {
      await emailjs.send(serviceID, templateID, emailParams, publicKey);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      setSubmitStatus({
        type: "success",
        message: "Message envoyé avec succès via EmailJS !"
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Erreur EmailJS complète :", error);
      setSubmitStatus({
        type: "error",
        message: error.text || error.message || "Erreur lors de l'envoi. Veuillez réessayer."
      });
    }    
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Contactez-nous</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une question ? Un projet ? Notre équipe est là pour vous répondre rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-4">
                <Mail className="text-gray-600" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">theoshopecommerce@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-4">
                <Phone className="text-gray-600" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">Téléphone</h3>
                  <p className="text-gray-600">+33 07 69 18 50 43</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-gray-600" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">Adresse</h3>
                  <p className="text-gray-600">123 Rue du Commerce<br />75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleContactChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                        formErrors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"
                      }`}
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleContactChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                        formErrors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"
                      }`}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleContactChange}
                    placeholder="Sujet de votre message"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleContactChange}
                    placeholder="Votre message"
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                      formErrors.message ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"
                    }`}
                  />
                  {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
                </div>

                {submitStatus && (
                  <div className={`p-4 rounded-lg flex items-start space-x-2 ${
                    submitStatus.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}>
                    {submitStatus.type === "error" ? (
                      <X className="w-5 h-5 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mt-0.5" />
                    )}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;