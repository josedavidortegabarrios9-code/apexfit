package com.apexfit.backend.repository;

import com.apexfit.backend.entity.Rutina;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RutinaRepository extends JpaRepository<Rutina, Integer> {
    Page<Rutina> findByCliente_IdUsuario(Integer idCliente, Pageable pageable);
    Page<Rutina> findByEntrenador_IdUsuario(Integer idEntrenador, Pageable pageable);
}
