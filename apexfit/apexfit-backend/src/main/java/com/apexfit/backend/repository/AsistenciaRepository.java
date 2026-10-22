package com.apexfit.backend.repository;

import com.apexfit.backend.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByUsuario_IdUsuario(Integer idUsuario);
    long countByFecha(java.time.LocalDate fecha);
}
