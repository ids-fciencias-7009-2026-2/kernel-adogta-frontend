/**
 * Modal con términos y condiciones de la plataforma
 * @param {boolean} isOpen - si el modal está visible
 * @param {function} onClose - para cerrar el modal
 */
const Terms = ({ isOpen, onClose }) => {
    // Si el modal está cerrado, no renderiza nada
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fade-in"
        onClick={onClose}
      >
        {/* Contenido del modal */}
        <div 
          className="bg-white rounded-2xl max-w-[550px] w-[90%] max-h-[85vh] p-7 relative overflow-auto shadow-xl animate-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-adogta-primary text-2xl font-bold text-center m-0 mb-5 pb-3 border-b-2 border-adogta-secondary">
            Términos y Condiciones
          </h3>
          
          {/* Contenido scrolleable */}
          <div className="text-adogta-primary text-sm leading-relaxed mb-6">
            <p><strong>1. Aceptación de términos</strong></p>
            <p>Al registrarte en Adogta, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con algún punto, no debes utilizar la plataforma.</p>
            
            <p><strong>2. Veracidad de la información</strong></p>
            <p>Te comprometes a proporcionar información verídica, completa y actualizada en tu perfil. La información falsa puede resultar en la suspensión de tu cuenta.</p>
            
            <p><strong>3. Uso responsable de la plataforma</strong></p>
            <p>Adogta es una plataforma diseñada exclusivamente para facilitar la adopción responsable de perros y gatos. No se permite el uso para:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Venta o comercialización de animales</li>
              <li>Publicación de contenido inapropiado, ofensivo o ilegal</li>
              <li>Actividades fraudulentas o engañosas</li>
              <li>Acoso a otros usuarios</li>
            </ul>
            
            <p><strong>4. Protección de datos personales</strong></p>
            <p>Tus datos personales serán tratados conforme a las leyes de protección de datos aplicables. No compartiremos tu información con terceros sin tu consentimiento.</p>
            
            <p><strong>5. Cancelación de cuenta</strong></p>
            <p>Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos. Tú también puedes cancelar tu cuenta en cualquier momento.</p>
            
            <p><strong>6. Modificaciones</strong></p>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma.</p>
          </div>
          
          {/* Botón para cerrar y aceptar */}
          <button 
            onClick={onClose}
            className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95 w-full"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  export default Terms;