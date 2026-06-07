import prisma from "../config/prismaClient";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🚀 Iniciando seed...");

  // Limpa dados antigos (ordem respeita FK: dependentes primeiro)
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Dados antigos apagados.");

  // Criar professor
  const instructorPassword = await bcrypt.hash("123456", 10);
  const instructor = await prisma.user.create({
    data: {
      name: "Professor Teste",
      email: "prof@example.com",
      password: instructorPassword,
      role: "INSTRUCTOR"
    }
  });

  console.log("👨‍🏫 Professor criado:", instructor);

  // Criar aluno
  const studentPassword = await bcrypt.hash("123456", 10);
  const student = await prisma.user.create({
    data: {
      name: "Felippe",
      email: "felippe@example.com",
      password: studentPassword,
      role: "STUDENT"
    }
  });

  console.log("🎓 Aluno criado:", student);

  // Criar curso
  const course = await prisma.course.create({
    data: {
      title: "Curso Teste Completo",
      description: "Curso criado automaticamente pelo seed.",
      instructorId: instructor.id
    }
  });

  console.log("📘 Curso criado:", course);

  // Criar módulo
  const module1 = await prisma.module.create({
    data: {
      title: "Módulo 1",
      courseId: course.id
    }
  });

  console.log("📚 Módulo criado:", module1);

  // Criar Lessons
  const lessons = await prisma.lesson.createMany({
    data: [
      {
        title: "Aula 1",
        content: "Conteúdo da aula 1",
        videoUrl: "https://video.com/1",
        courseId: course.id,
        moduleId: module1.id
      },
      {
        title: "Aula 2",
        content: "Conteúdo da aula 2",
        videoUrl: "https://video.com/2",
        courseId: course.id,
        moduleId: module1.id
      },
      {
        title: "Aula 3",
        content: "Conteúdo da aula 3",
        videoUrl: "https://video.com/3",
        courseId: course.id,
        moduleId: module1.id
      }
    ]
  });

  console.log("🎥 Lessons criadas:", lessons);

  // Pegar IDs das aulas
  const lessonList = await prisma.lesson.findMany({
    where: { courseId: course.id }
  });

  // Criar progresso (100%)
  for (const lesson of lessonList) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: lesson.id
      }
    });
  }

  console.log("🏆 Progresso 100% criado.");

  // Criar matrícula
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id
    }
  });

  console.log("📝 Matrícula criada.");

  console.log("🌱 Seed finalizado com sucesso!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
