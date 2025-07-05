// Utility para limpar completamente a autenticação
export function clearAllAuthData() {
  // Limpar localStorage
  localStorage.removeItem('financeflow_user');
  localStorage.removeItem('financeflow_token');
  
  // Limpar sessionStorage
  sessionStorage.removeItem('financeflow_user');
  sessionStorage.removeItem('financeflow_token');
  
  // Limpar cookies (se houver)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log("Todos os dados de autenticação foram limpos");
}