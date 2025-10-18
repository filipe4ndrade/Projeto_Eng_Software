function deletePatient(patientId) {
    if (confirm(`Tem certeza que deseja excluir o paciente ${patientId}?`)) {
      
        fetch(`/patients/api/${patientId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 204) {
              
                alert('Paciente excluído com sucesso!');
                window.location.reload(); 
            } else if (response.status === 404) {
                alert('Erro: Paciente não encontrado.');
            } else {
                alert('Erro ao excluir o paciente.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição DELETE:', error);
            alert('Erro de conexão ao tentar excluir.');
        });
    }
}