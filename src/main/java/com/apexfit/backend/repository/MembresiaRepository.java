package com.apexfit.backend.repository;

import com.apexfit.backend.entity.Membresia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresia, Integer> {
    List<Membresia> findByUsuario_IdUsuario(Integer idUsuario);
    long countByEstado(String estado);
}
